import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

interface NgAddOptions {
  project?: string;
}

/**
 * `ng add @keepui/ui` schematic.
 *
 * Installs the package and prints guidance on how to register
 * `provideKeepUi()` in the host application's `app.config.ts`.
 */
export function ngAdd(_options: NgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    context.logger.info('');
    context.logger.info('✅ KeepUI has been added to your project!');
    context.logger.info('');
    context.logger.info('Next steps:');
    context.logger.info(
      '  1. Open your app.config.ts and add provideKeepUi() to the providers array:',
    );
    context.logger.info('');
    context.logger.info("     import { provideKeepUi } from '@keepui/ui';");
    context.logger.info('');
    context.logger.info('     export const appConfig: ApplicationConfig = {');
    context.logger.info('       providers: [provideKeepUi()],');
    context.logger.info('     };');
    context.logger.info('');
    context.logger.info('  2. Use KeepUI components in your templates:');
    context.logger.info("     import { ImagePreviewComponent } from '@keepui/ui';");
    context.logger.info('');
    context.logger.info(
      '  3. For Capacitor projects, use provideKeepUiCapacitor() from @keepui/ui/capacitor instead.',
    );
    context.logger.info('');

    return tree;
  };
}
