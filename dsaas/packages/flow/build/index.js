'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var events = require('events');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

(function (ACTION_STATUS) {
    ACTION_STATUS["not_run"] = "not_run";
    ACTION_STATUS["running"] = "running";
    ACTION_STATUS["done"] = "done";
})(exports.ACTION_STATUS || (exports.ACTION_STATUS = {}));

class Action {
    constructor(definition, flow, application) {
        this.definition = definition;
        this.flow = flow;
        this.application = application;
        this.inputs = {};
        this.outputs = {};
        this.options = {};
        this.status = exports.ACTION_STATUS.not_run;
        this.description = '';
        this.label = '';
        this.id = '';
        this.actionType = '';
        this.runFunction = () => { };
        const { description, inputs, label, outputs, id, run } = application.findActionDefinition(definition.actionType);
        Object.assign(this, {
            description,
            inputs,
            label,
            outputs,
            id: definition.id,
            actionType: id
        });
        this.runFunction = run;
    }
    run(passedInputs = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = exports.ACTION_STATUS.running;
            const output = yield this.runFunction(passedInputs);
            this.outputs = output;
            this.status = exports.ACTION_STATUS.done;
            return output;
        });
    }
}

const double = {
    id: 'double',
    run({ number }) {
        return {
            number: number * 2
        };
    }
};
const convertToString = {
    id: 'convertToString',
    run({ number }) {
        return {
            text: number.value.toString()
        };
    }
};
const customValue = {
    id: 'customValue',
    run({ value }) {
        return {
            value
        };
    }
};
const wait = {
    id: 'wait',
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(r => setTimeout(r, 3000));
            return {};
        });
    }
};
const flowStart = {
    id: 'flowStart',
    run({ input }) {
        console.log('starting');
        return { input: input };
    }
};
const flowEnd = {
    id: 'flowEnd',
    run({ output }) {
        return { output };
    }
};

class Flow {
    constructor(definition, application) {
        this.definition = definition;
        this.application = application;
        this.actions = new Map();
        this.transitions = [];
        this.events = new events.EventEmitter();
        definition.actions.forEach(this.registerAction.bind(this));
        this.transitions = definition.transitions;
    }
    run(input) {
        return __awaiter(this, void 0, void 0, function* () {
            this.runAction('flowStart', input);
            return new Promise(resolve => {
                this.events.on('flowEnd', value => {
                    resolve(value);
                });
            });
        });
    }
    runAction(id, values = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = this.findActionInstance(id);
            const transitionsIn = this.findTransitionsToAction(action.id);
            const fromInstances = transitionsIn.map(transition => this.findActionInstance(transition.from));
            const countOfRunningFromInstances = this.countInstanceStatus(exports.ACTION_STATUS.running, fromInstances);
            // Stop if upstream instances are still running
            if (countOfRunningFromInstances > 0)
                return;
            const countOfNotRunFromInstances = this.countInstanceStatus(exports.ACTION_STATUS.not_run, fromInstances);
            // run upstream actions. These will recall this downstream
            if (countOfNotRunFromInstances > 0) {
                fromInstances.forEach(instance => {
                    if (instance.status === exports.ACTION_STATUS.not_run) {
                        this.runAction(instance.id);
                    }
                });
                return;
            }
            //Assume here all are done, but check just in case for now.
            if (!fromInstances.every(instance => instance.status === exports.ACTION_STATUS.done)) {
                throw new Error('shouldnt get here because all instances should be done');
            }
            // get input action outputs
            const inputValues = transitionsIn.reduce((input, transition) => {
                const instance = fromInstances.find(inst => inst.id === transition.from);
                const mapping = {};
                for (let key in transition.map) {
                    mapping[transition.map[key]] = instance === null || instance === void 0 ? void 0 : instance.outputs[key];
                }
                return Object.assign(Object.assign({}, input), mapping);
            }, {});
            const output = yield action.run(Object.assign(Object.assign({}, values), inputValues));
            // Trigger flow end if it's a flow end action
            if (action.actionType === 'flowEnd') {
                this.events.emit('flowEnd', output);
            }
            // Run downflow actions
            const transitionsOut = this.findTransitionsFromAction(action.id);
            transitionsOut.forEach(transition => this.runAction(transition.to));
        });
    }
    registerAction(definition) {
        const action = new Action(definition, this, this.application);
        this.actions.set(definition.id, action);
    }
    findActionInstance(id) {
        const definition = this.actions.get(id);
        if (!definition)
            throw new Error(`Action Definition ${id} not found.`);
        return definition;
    }
    findTransitionsToAction(id) {
        return this.transitions.filter(transition => transition.to === id);
    }
    findTransitionsFromAction(id) {
        return this.transitions.filter(transition => transition.from === id);
    }
    countInstanceStatus(status, instances) {
        return instances.reduce((count, instance) => {
            return instance.status === status ? count + 1 : count;
        }, 0);
    }
}

class Application {
    constructor() {
        this.actionDefinitions = new Map();
        this.TypeDefinitions = new Map();
        this.flowDefinitions = new Map();
        this.loadDefault();
    }
    loadDefault() {
        this.registerAction(flowStart);
        this.registerAction(flowEnd);
    }
    load(config) {
        config.flowDefinitions.forEach(definition => this.registerFlowDefinition(definition));
    }
    runFlow(id, input = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const flowDefinition = this.findFlowDefinition(id);
            const flow = new Flow(flowDefinition, this);
            return yield flow.run(input);
        });
    }
    registerTypeDefinition(definition) {
        this.TypeDefinitions.set(definition.id, definition);
    }
    registerAction(definition) {
        this.actionDefinitions.set(definition.id, definition);
    }
    registerActions(definitions) {
        definitions.forEach(definition => this.registerAction(definition));
    }
    registerFlowDefinition(definition) {
        this.flowDefinitions.set(definition.id, definition);
    }
    findActionDefinition(id) {
        const definition = this.actionDefinitions.get(id);
        if (!definition)
            throw new Error(`Action Definition ${id} not found.`);
        return definition;
    }
    findFlowDefinition(id) {
        const definition = this.flowDefinitions.get(id);
        if (!definition)
            throw new Error(`Flow Definition ${id} not found.`);
        return definition;
    }
}

exports.Action = Action;
exports.Application = Application;
exports.Flow = Flow;
exports.convertToString = convertToString;
exports.customValue = customValue;
exports.double = double;
exports.flowEnd = flowEnd;
exports.flowStart = flowStart;
exports.wait = wait;
//# sourceMappingURL=index.js.map
