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
import availableTags from '../../../example/tags/tags.json';

export default class AnnotationAPI {

    constructor(openmct) {
        this.openmct = openmct;
        this.ANNOTATION_TYPES = Object.freeze({
            NOTEBOOK: 'notebook',
            GEOSPATIAL: 'geospatial',
            PIXEL_SPATIAL: 'pixelspatial',
            TEMPORAL: 'temporal'
        });

        this.openmct.types.addType('annotation', {
            name: 'Annotation',
            description: 'A user created note or comment about time ranges, pixel space, and geospatial features.',
            creatable: true,
            cssClass: 'icon-notebook',
            initialize: function (domainObject) {
                domainObject.targets = domainObject.targets || {};
                domainObject.originalContextPath = domainObject.originalContextPath || '';
                domainObject.tags = domainObject.tags || [];
                domainObject.contentText = domainObject.contentText || '';
                domainObject.annotationType = domainObject.annotationType || this.ANNOTATION_TYPES.TEMPORAL;
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
    async create(targetDomainObject, name, annotationType, tags, contentText, originalContextPath, targetOptions) {
        if (Object.keys(this.ANNOTATION_TYPES).includes(annotationType)) {
            throw new Error(`Unknown annotation type: ${annotationType}`);
        }

        const type = 'annotation';
        const typeDefinition = this.openmct.types.get(type);
        const definition = typeDefinition.definition;

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
        createdObject.targets[targetKeyString] = targetOptions || {};

        const success = await this.openmct.objects.save(createdObject);
        if (success) {
            return createdObject;
        } else {
            throw new Error('Failed to create object');
        }
    }

    getAvailableTags() {
        return availableTags.tags;
    }

    getNotebookAnnotation(entryId, targetDomainObject) {

        return null;
    }

    setNotebookAnnotationTag(entryId, targetDomainObject, tag, originalContextPath) {
        let existingAnnotation = this.getNotebookAnnotation(entryId, targetDomainObject);
        if (!existingAnnotation) {
            const targetOptions = {
                entryId: entryId
            };
            existingAnnotation = this.create(targetDomainObject, 'notebook entry tag', this.ANNOTATION_TYPES.NOTEBOOK, [tag], '', originalContextPath, targetOptions);
        } else {
            this.openmct.objects.mutate(existingAnnotation, 'tags', [tag]);
        }
    }
}
