import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";
import { ArtifactRegistryRepositoryIamMember } from "@cdktf/provider-google/lib/artifact-registry-repository-iam-member";
import { IamWorkloadIdentityPool } from "@cdktf/provider-google/lib/iam-workload-identity-pool";
import { IamWorkloadIdentityPoolProvider } from "@cdktf/provider-google/lib/iam-workload-identity-pool-provider";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { ServiceAccountIamMember } from "@cdktf/provider-google/lib/service-account-iam-member";
import { ComputeInstance } from "@cdktf/provider-google/lib/compute-instance";
import { SecretManagerSecret } from "@cdktf/provider-google/lib/secret-manager-secret";
import { SecretManagerSecretIamMember } from "@cdktf/provider-google/lib/secret-manager-secret-iam-member";
import { COMPUTE_ZONE, GITHUB_REPO, PROJECT, REGION, REGISTRY_URL } from "./constants";

export class LuciBotStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, "google", {
      project: PROJECT,
      region: REGION,
    });

    // Artifact Registry — Docker repo, keep 2 images max
    const registry = new ArtifactRegistryRepository(this, "registry", {
      repositoryId: "lucibot",
      format: "DOCKER",
      location: REGION,
      cleanupPolicies: [
        {
          id: "keep-2-most-recent",
          action: "KEEP",
          mostRecentVersions: {
            keepCount: 2,
          },
        },
        {
          id: "delete-old",
          action: "DELETE",
          condition: {
            tagState: "ANY",
          },
        },
      ],
      cleanupPolicyDryRun: false,
    });

    // Workload Identity Pool + GitHub OIDC provider
    const pool = new IamWorkloadIdentityPool(this, "github-pool", {
      workloadIdentityPoolId: "github-pool",
      displayName: "GitHub Actions Pool",
    });

    new IamWorkloadIdentityPoolProvider(this, "github-provider", {
      workloadIdentityPoolId: pool.workloadIdentityPoolId,
      workloadIdentityPoolProviderId: "github-provider",
      displayName: "GitHub Actions Provider",
      attributeMapping: {
        "google.subject": "assertion.sub",
        "attribute.repository": "assertion.repository",
        "attribute.actor": "assertion.actor",
      },
      attributeCondition: `attribute.repository == "${GITHUB_REPO}"`,
      oidc: {
        issuerUri: "https://token.actions.githubusercontent.com",
      },
    });

    // Service account that GitHub Actions will impersonate
    const sa = new ServiceAccount(this, "github-actions-sa", {
      accountId: "github-actions-lucibot",
      displayName: "GitHub Actions — LuciBot",
    });

    // Allow the GitHub repo's OIDC identity to impersonate the SA
    new ServiceAccountIamMember(this, "wif-sa-binding", {
      serviceAccountId: sa.name,
      role: "roles/iam.workloadIdentityUser",
      member: `principalSet://iam.googleapis.com/${pool.name}/attribute.repository/${GITHUB_REPO}`,
    });

    // Allow the SA to push images to the registry
    new ArtifactRegistryRepositoryIamMember(this, "sa-registry-writer", {
      repository: registry.name,
      location: REGION,
      role: "roles/artifactregistry.writer",
      member: `serviceAccount:${sa.email}`,
    });

    // Secrets for bot credentials
    const tokenSecret = new SecretManagerSecret(this, "token-secret", {
      secretId: "TOKEN_ID",
      replication: { auto: {} },
    });

    const clientIdSecret = new SecretManagerSecret(this, "client-id-secret", {
      secretId: "CLIENT_ID",
      replication: { auto: {} },
    });

    const groqTokenSecret = new SecretManagerSecret(this, "groq-token-secret", {
      secretId: "GROQ_TOKEN",
      replication: { auto: {} },
    });

    // Service account for the VM to pull images from the registry
    const vmSa = new ServiceAccount(this, "vm-sa", {
      accountId: "lucibot-vm",
      displayName: "LuciBot VM",
    });

    new SecretManagerSecretIamMember(this, "vm-sa-token-secret", {
      secretId: tokenSecret.secretId,
      role: "roles/secretmanager.secretAccessor",
      member: `serviceAccount:${vmSa.email}`,
    });

    new SecretManagerSecretIamMember(this, "vm-sa-client-id-secret", {
      secretId: clientIdSecret.secretId,
      role: "roles/secretmanager.secretAccessor",
      member: `serviceAccount:${vmSa.email}`,
    });

    new SecretManagerSecretIamMember(this, "vm-sa-groq-token-secret", {
      secretId: groqTokenSecret.secretId,
      role: "roles/secretmanager.secretAccessor",
      member: `serviceAccount:${vmSa.email}`,
    });

    new ArtifactRegistryRepositoryIamMember(this, "vm-sa-registry-reader", {
      repository: registry.name,
      location: REGION,
      role: "roles/artifactregistry.reader",
      member: `serviceAccount:${vmSa.email}`,
    });

    // e2-micro VM on Container-Optimized OS — qualifies for always-free tier
    new ComputeInstance(this, "bot-vm", {
      name: "lucibot",
      machineType: "e2-micro",
      zone: COMPUTE_ZONE,
      bootDisk: {
        initializeParams: {
          image: "cos-cloud/cos-stable",
        },
      },
      networkInterface: [
        {
          network: "default",
          accessConfig: [{}], // ephemeral external IP
        },
      ],
      metadata: {
        "gce-container-declaration": [
          "spec:",
          "  containers:",
          "  - name: lucibot",
          `    image: ${REGISTRY_URL}/lucibot:latest`,
          "    stdin: false",
          "    tty: false",
          "  restartPolicy: Always",
        ].join("\n"),
      },
      serviceAccount: {
        email: vmSa.email,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      },
      allowStoppingForUpdate: true,
    });
  }
}
