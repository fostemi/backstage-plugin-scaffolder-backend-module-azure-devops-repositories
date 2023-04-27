import { ScmIntegrationRegistry } from '@backstage/integration';
import { resolveSafeChildPath } from "@backstage/backend-common";
import { InputError } from '@backstage/errors';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { cloneRepo } from "../helpers";

/**
 * Creates an `ado:repo:clone` Scaffolder action.
 *
 * @remarks
 *
 * This Scaffolder action will clone a repository from ADO into the workspace to modify.
 *
 * @public
 */
export const cloneAzureRepoAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction<{
    remoteUrl: string;
    branch?: string;
    targetPath?: string;
    token?: string;
  }>({
    id: 'ado:repo:clone',
    description: 'Clone Azure DevOps repo into the workspace directory.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'remoteUrl'],
        properties: {
          remoteUrl: {
            title: 'Remote URL',
            description: 'The Git URL to the repo.',
            type: 'string',
          },
          branch: {
            title: 'Repo Branch',
            type: 'string',
            description: 'The branch to clone from.',
          },
          targetPath: {
            title: 'Working Subdirectory',
            type: 'string',
            description: 'The subdirectory of workspace to clone the repo into.',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token used for authorization.',
          },
        },
      },
    },

    async handler(ctx) {
      const { remoteUrl, branch } = ctx.input;

      const targetPath = ctx.input.targetPath ?? "./";
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

      const host = 'dev.azure.com';
      const integrationConfig = integrations.azure.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
            `No matching integration config for host ${host}, please check your integrations config.`
        );
      }

      if (!integrationConfig.config.token && !ctx.input.token) {
        throw new InputError(
            `No token provided for Azure Integration ${host}.`
        );
      }

      const token = ctx.input.token ?? integrationConfig.config.token!;

      await cloneRepo({
        dir: outputDir,
        auth: { username: "notempty", password: token },
        logger: ctx.logger,
        remoteUrl: remoteUrl,
        branch: branch,
      })
    },
  });
}
