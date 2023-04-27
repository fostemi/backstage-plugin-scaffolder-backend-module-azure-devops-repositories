// eslint-disable-next-line @backstage/no-undeclared-imports
import { Git } from "@backstage/backend-common";
import { Logger } from "winston";

export async function cloneRepo({
    dir,
    auth,
    logger,
    remote = "origin",
    remoteUrl,
    branch = "main",
}: {
    dir: string,
    auth: { username: string; password: string } | { token: string };
    logger: Logger;
    remote?: string;
    remoteUrl: string;
    branch?: string;
}): Promise<void> {
    const git = Git.fromAuth({
        ...auth,
        logger,
    });

    await git.clone({
        url: remoteUrl,
        dir,
    });

    await git.addRemote({
        dir,
        remote,
        url: remoteUrl,
    });

    await git.checkout({
        dir,
        ref: branch,
    });
}

export async function checkoutCommitAndPushRepo({
    dir,
    auth,
    logger,
    remote = "origin",
    commitMessage,
    gitAuthorInfo,
    branch = "backstage",
}: {
    dir: string;
    auth: { username: string; password: string } | { token: string };
    logger: Logger;
    remote?: string;
    commitMessage: string;
    gitAuthorInfo?: { name?: string; email?: string };
    branch?: string;
}): Promise<void> {
    const authorInfo = {
        name: gitAuthorInfo?.name ?? "Scaffolder",
        email: gitAuthorInfo?.email ?? "scaffolder@backstage.io",
    };

    const git = Git.fromAuth({
        ...auth,
        logger,
    });

    await git.checkout({
        dir,
        ref: branch,
    });

    await git.add({
        dir,
        filepath: ".",
    });

    await git.commit({
        dir,
        message: commitMessage,
        author: authorInfo,
        committer: authorInfo,
    });

    await git.push({
       dir,
       remote: remote,
       remoteRef: `refs/heads/${branch}`,
    })
}
