"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = ngAdd;
const tasks_1 = require("@angular-devkit/schematics/tasks");
/**
 * `ng add @keepui/ui` schematic.
 *
 * Installs the package and prints guidance on how to register
 * `provideKeepUi()` in the host application's `app.config.ts`.
 */
function ngAdd(_options) {
    return (tree, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.info('');
        context.logger.info('✅ KeepUI has been added to your project!');
        context.logger.info('');
        context.logger.info('Next steps:');
        context.logger.info('  1. Open your app.config.ts and add provideKeepUi() to the providers array:');
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
        context.logger.info('  3. For Capacitor projects, use provideKeepUiCapacitor() from @keepui/ui/capacitor instead.');
        context.logger.info('');
        return tree;
    };
}
//# sourceMappingURL=index.js.map