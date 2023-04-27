import { PassThrough } from 'stream';
import { cloneAzureRepoAction } from './cloneADORepo';
import { getVoidLogger } from '@backstage/backend-common';

describe('ado:repo:clone', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // test for clone azure repo action
  // first we need to create the options
  it('should call action', async () => {
    const action = cloneAzureRepoAction(
        options = {
          
        }
    );

    const logger = getVoidLogger();
    jest.spyOn(logger, 'info');

    await action.handler({
      input: {
        remoteUrl: 'test',
        branch: 'backstage',
        token: 'token',
      },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        // Usage of mock-fs is recommended for testing of filesystem operations
        throw new Error('Not implemented');
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Running run template with parameters: test',
    );
  });
});
