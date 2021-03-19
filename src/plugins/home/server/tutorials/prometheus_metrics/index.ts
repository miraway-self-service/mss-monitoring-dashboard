/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { i18n } from '@osd/i18n';
import { TutorialsCategory } from '../../services/tutorials';
import {
  onPremInstructions,
} from '../instructions/metricbeat_instructions';
import {
  TutorialContext,
  TutorialSchema,
} from '../../services/tutorials/lib/tutorials_registry_types';

export function prometheusMetricsSpecProvider(context: TutorialContext): TutorialSchema {
  const moduleName = 'prometheus';
  return {
    id: moduleName + 'Metrics',
    name: i18n.translate('home.tutorials.prometheusMetrics.nameTitle', {
      defaultMessage: 'Prometheus metrics',
    }),
    moduleName,
    isBeta: false,
    category: TutorialsCategory.METRICS,
    shortDescription: i18n.translate('home.tutorials.prometheusMetrics.shortDescription', {
      defaultMessage: 'Fetch metrics from a Prometheus exporter.',
    }),
    longDescription: i18n.translate('home.tutorials.prometheusMetrics.longDescription', {
      defaultMessage:
        'The `{moduleName}` Metricbeat module fetches metrics from Prometheus endpoint. \
[Learn more]({learnMoreLink}).',
      values: {
        moduleName,
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-' + moduleName + '.html',
      },
    }),
    euiIconType: 'logoPrometheus',
    artifacts: {
      application: {
        label: i18n.translate('home.tutorials.prometheusMetrics.artifacts.application.label', {
          defaultMessage: 'Discover',
        }),
        path: '/app/discover#/',
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-' + moduleName + '.html',
      },
    },
    completionTimeMinutes: 10,
    onPrem: onPremInstructions(moduleName, context),
  };
}
