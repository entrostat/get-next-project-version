import { Command, flags } from '@oclif/command';
import { exec } from 'child_process';

class GetNextProjectVersion extends Command {
    static description = 'Runs a dry run on standard-version and looks at what the next version would be.';

    static flags = {
        'no-version-prefix': flags.boolean({
            char: 'n',
            description: 'Whether to leave out the "v" in front of the package.json version.',
        }),
    };

    static args = [];

    async run() {
        const { args, flags } = this.parse(GetNextProjectVersion);

        const dryRunResult: string = await new Promise((resolve, reject) => {
            exec('npx standard-version --dry-run', (error, stdout, stderr) => {
                if (error) {
                    return reject(stderr);
                }
                return resolve(stdout);
            });
        });

        const regex = /bumping version in package.json from \d+\.\d+\.\d+ to (\d+\.\d+\.\d+)/gim;
        const matches = regex.exec(dryRunResult);

        if (matches) {
            this.log(`${flags['no-version-prefix'] ? '' : 'v'}${matches[1]}`);
        } else {
            this.exit(1);
        }
    }
}

export = GetNextProjectVersion;
