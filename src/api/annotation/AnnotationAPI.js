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
        const rearrangedToArray = Object.keys(availableTags.tags).map(tagKey => {
            return {
                id: tagKey,
                ...availableTags.tags[tagKey]
            };
        });

        return rearrangedToArray;
    }

    getSearchProvider() {
        const searchProviders = Object.values(this.openmct.objects.providers).filter(provider => {
            return provider.searchForAnnotationsByTargetByIDAndNotebookEntry;
        });
        if (searchProviders) {
            return searchProviders[0];
        } else {
            return null;
        }
    }

    async getNotebookAnnotation(entryId, targetDomainObject) {
        const targetKeyString = this.openmct.objects.makeKeyString(targetDomainObject.identifier);
        let foundAnnotation = null;
        // being "expedient" here and just assuming we've got the couch provider
        const searchProvider = this.getSearchProvider();
        if (searchProvider) {
            const searchResults = await searchProvider.searchForAnnotationsByTargetByIDAndNotebookEntry(targetKeyString, entryId, null);
            if (searchResults) {
                foundAnnotation = searchResults[0];
            }
        }

        return foundAnnotation;
    }

    async addNotebookAnnotationTag(entryId, targetDomainObject, tag, originalContextPath) {
        console.debug(`Going to add ${tag}`);
        let existingAnnotation = await this.getNotebookAnnotation(entryId, targetDomainObject);

        if (!existingAnnotation) {
            const targetOptions = {
                entryId: entryId
            };
            const tagArray = tag ? [tag] : [];
            existingAnnotation = await this.create(targetDomainObject, 'notebook entry tag', this.ANNOTATION_TYPES.NOTEBOOK, tagArray, '', originalContextPath, targetOptions);
        } else if (existingAnnotation.tags.includes(tag)) {
            return;
        } else {
            const tagArray = existingAnnotation.tags;
            tagArray.push(tag);
            this.openmct.objects.mutate(existingAnnotation, 'tags', tagArray);
        }
    }

    async removeNotebookAnnotationTag(entryId, targetDomainObject, tagToRemove) {
        console.debug(`Going to remove ${tagToRemove}`);
        let existingAnnotation = await this.getNotebookAnnotation(entryId, targetDomainObject);

        if (existingAnnotation && existingAnnotation.tags.includes(tagToRemove)) {
            const cleanedArray = existingAnnotation.tags.filter(extantTag => extantTag !== tagToRemove);
            this.openmct.objects.mutate(existingAnnotation, 'tags', cleanedArray);
        } else {
            throw new Error(`Asked to remove notebook tag (${tagToRemove}) that doesn't exist for ${entryId}`);
        }

    }

    async changeNotebookAnnotationTag(entryId, targetDomainObject, tagToRemove, tagToAdd) {
        console.debug(`Going to change ${tagToRemove} to ${tagToAdd}`);
        let existingAnnotation = await this.getNotebookAnnotation(entryId, targetDomainObject);
        const cleanedArray = existingAnnotation.tags.filter(extantTag => (extantTag !== tagToRemove) && (extantTag !== tagToAdd));
        cleanedArray.push(tagToAdd);
        console.debug(`tags are`, cleanedArray);
        this.openmct.objects.mutate(existingAnnotation, 'tags', cleanedArray);
    }

    getMatchingTags(query) {
        const allTags = availableTags.tags;
        const matchingTags = Object.keys(allTags).filter(tagKey => {
            return allTags[tagKey].label.includes(query);
        }).map(tagKey => {
            return tagKey;
        });

        return matchingTags;
    }

    async searchForTags(query, abortController) {
        // get matching tags first
        const matchingTags = this.getMatchingTags(query);
        // being "expedient" here and just assuming we've got the couch provider
        const searchProvider = this.getSearchProvider();
        if (searchProvider) {
            const searchResults = await searchProvider.searchForTagsByTextQuery(matchingTags, abortController);

            return searchResults;
        }
    }
}
