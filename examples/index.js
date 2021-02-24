/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file example entry
 * @author clark-t
 */

import san, {Component} from 'san';
import Video from './src/index';

const Preview = san.defineComponent({
    template: /* html */ `
        <div class="demo-wrapper">
            <ui-demo />
        </div>
    `,
    components: {
        'ui-demo': Video
    },
    initData() {
        return {
        };
    }
});
const App = Preview;
const app = new App();
app.attach(document.getElementById('app'));
