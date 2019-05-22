import './scss/style';

import grapesjs from 'grapesjs';

import snippet001 from './snippets/snippet001';
import snippet002 from './snippets/snippet002';
import snippet003 from './snippets/snippet003';

const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: { type: null },

    blockManager: {
        appendTo: '#blocks',
        blocks: [
            snippet001,
            snippet002,
            snippet003,
        ]
    },

    layerManager: {
        appendTo: '.layers-container'
    },

    panels: {
        defaults: [{
                id: 'layers',
                el: '.panel__right',
                resizable: {
                    maxDim: 550,
                    minDim: 300,
                    tc: 0, // Top handler
                    cl: 1, // Left handler
                    cr: 0, // Right handler
                    bc: 0, // Bottom handler
                    keyWidth: 'flex-basis',
                },
            },
            {
                id: 'panel-switcher',
                el: '.panel__switcher',
                id: 'panel-switcher',
                el: '.panel__switcher',
                buttons: [{
                        id: 'show-layers',
                        active: true,
                        label: 'Layers',
                        command: 'show-layers',
                        // Once activated disable the possibility to turn it off
                        togglable: false,
                    }, {
                        id: 'show-style',
                        active: true,
                        label: 'Styles',
                        command: 'show-styles',
                        togglable: false,
                    },
                    {
                        id: 'show-traits',
                        active: true,
                        label: 'Traits',
                        command: 'show-traits',
                        togglable: false,
                    }
                ],
            }
        ]
    },

    traitManager: {
        appendTo: '.traits-container',
    },

    styleManager: {
        appendTo: '.styles-container',
        sectors: [{
            name: 'Dimension',
            open: false,
            // Use built-in properties
            buildProps: ['width', 'min-height', 'padding'],
            // Use `properties` to define/override single property
            properties: [{
                // Type of the input,
                // options: integer | radio | select | color | slider | file | composite | stack
                type: 'integer',
                name: 'The width', // Label for the property
                property: 'width', // CSS property (if buildProps contains it will be extended)
                units: ['px', '%'], // Units, available only for 'integer' types
                defaults: 'auto', // Default value
                min: 0, // Min value, available only for 'integer' types
            }]
        }, {
            name: 'Extra',
            open: false,
            buildProps: ['custom-prop'],
            properties: [{
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                // List of options, available only for 'select' and 'radio'  types
                options: [
                    { value: '12px', name: 'Tiny' },
                    { value: '18px', name: 'Medium' },
                    { value: '32px', name: 'Big' },
                ],
            }]
        }]
    },
});

// Define commands
editor.Commands.add('show-layers', {
    getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
    getLayersEl(row) { return row.querySelector('.layers-container') },

    run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
    },
    stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
    },
});
editor.Commands.add('show-styles', {
    getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
    getStyleEl(row) { return row.querySelector('.styles-container') },

    run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
    },
    stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
    },
});
editor.Commands.add('show-traits', {
    getTraitsEl(editor) {
        const row = editor.getContainer().closest('.editor-row');
        return row.querySelector('.traits-container');
    },
    run(editor, sender) {
        this.getTraitsEl(editor).style.display = '';
    },
    stop(editor, sender) {
        this.getTraitsEl(editor).style.display = 'none';
    },
});

editor.Panels.addPanel({
    id: 'panel-top',
    el: '.panel__top',
});

editor.Panels.addPanel({
    id: 'basic-actions',
    el: '.panel__basic-actions',
    buttons: [{
        id: 'visibility',
        active: true, // active by default
        className: 'btn-toggle-borders',
        label: '<u>B</u>',
        command: 'sw-visibility', // Built-in command
    }, {
        id: 'export',
        className: 'btn-open-export',
        label: 'Exp',
        command: 'export-template',
        context: 'export-template', // For grouping context of buttons from the same panel
    }, {
        id: 'show-json',
        className: 'btn-show-json',
        label: 'JSON',
        context: 'show-json',
        command(editor) {
            editor.Modal.setTitle('Components JSON')
                        .setContent(`<textarea style="width:100%; height: 250px;">
                            ${JSON.stringify(editor.getComponents())}
                        </textarea>`)
                        .open();
        },
    }],
});

const blockManager = editor.BlockManager;
blockManager.add('the-row-block', {
  label: 'Container',
  content:
    `<div class="container editor-container" data-gjs-droppable=".row-cell">
    <div class="col-lg-6" style="height: 20px; border: 1px solid #ccc" data-gjs-draggable=".row"></div>
    </div>`,
});