/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2022, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import uuid from 'uuid';
import tags from '../../../example/tags/tags.json';

export default class AnnotationAPI {

    constructor(openmct) {
        this.openmct = openmct;

        this.openmct.types.addType('annotation', {
            name: 'Annotation',
            description: 'A user created note or comment about time ranges, pixel space, and geospatial features.',
            creatable: true,
            cssClass: 'icon-notebook',
            initialize: function (domainObject) {
                domainObject.targets = {};
                domainObject.originalContextPath = '';
                domainObject.tags = [];
                domainObject.contentText = '';
                domainObject.annotationType = null;
            }
        });
    }

    /**
    * Create the a generic annotation
    *
    * @method create
    * @param {module:openmct.DomainObject} domainObject the domain object to
    *        create
    * @returns {Promise} a promise which will resolve when the domain object
    *          has been created, or be rejected if it cannot be saved
    */
    async create(targetDomainObject, name, annotationType, tags, contentText, originalContextPath, options) {
        const type = 'annotation';
        const typeDefinition = this.openmct.types.get(type);
        const definition = typeDefinition.definition;
        tags = tags || [];
        const createdObject = {
            name,
            type,
            identifier: {
                key: uuid(),
                namespace: targetDomainObject.identifier.namespace
            },
            tags,
            annotationType,
            contentText,
            originalContextPath,
            location: targetDomainObject.location
        };
        if (definition.initialize) {
            definition.initialize(createdObject);
        }

        const targetKeyString = this.openmct.objects.makeKeyString(targetDomainObject.identifier);

        createdObject.targets[targetKeyString] = {};

        const success = await this.openmct.objects.save(createdObject);

        if (success) {
            return createdObject;
        } else {
            throw new Error('Failed to create object');
        }
    }

    getAvailableTags() {
        return tags.tags;
    }

    getNotebookAnnotation(entry) {
        const garbage = {
            foo: "foo"
        };

        return garbage;
    }
}
