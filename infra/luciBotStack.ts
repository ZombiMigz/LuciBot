import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { ArtifactRegistryRepository } from "@cdktf/provider-google/lib/artifact-registry-repository";
import { ArtifactRegistryRepositoryIamMember } from "@cdktf/provider-google/lib/artifact-registry-repository-iam-member";
import { IamWorkloadIdentityPool } from "@cdktf/provider-google/lib/iam-workload-identity-pool";
import { IamWorkloadIdentityPoolProvider } from "@cdktf/provider-google/lib/iam-workload-identity-pool-provider";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { ServiceAccountIamMember } from "@cdktf/provider-google/lib/service-account-iam-member";
import { GITHUB_REPO, PROJECT, REGION } from "./constants";

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
  }
}
