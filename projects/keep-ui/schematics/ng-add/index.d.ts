import { Rule } from '@angular-devkit/schematics';
interface NgAddOptions {
    project?: string;
}
/**
 * `ng add @keepui/ui` schematic.
 *
 * Installs the package and prints guidance on how to register
 * `provideKeepUi()` in the host application's `app.config.ts`.
 */
export declare function ngAdd(_options: NgAddOptions): Rule;
export {};
