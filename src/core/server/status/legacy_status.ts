/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

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

import { pick } from 'lodash';
import { i18n } from '@osd/i18n';
import { deepFreeze } from '@osd/std';

import { ServiceStatusLevels, ServiceStatus, CoreStatus } from './types';
import { PluginName } from '../plugins';
import { ExtensionName } from '../extensions';

interface Deps {
  overall: ServiceStatus;
  core: CoreStatus;
  plugins: Record<PluginName, ServiceStatus>;
  extensions: Record<ExtensionName, ServiceStatus>;
  versionWithoutSnapshot: string;
}

export interface LegacyStatusInfo {
  overall: LegacyStatusOverall;
  statuses: StatusComponentHttp[];
}

interface LegacyStatusOverall {
  state: LegacyStatusState;
  title: string;
  nickname: string;
  uiColor: LegacyStatusUiColor;
  /** ISO-8601 date string w/o timezone */
  since: string;
  icon?: string;
}

type LegacyStatusState = 'green' | 'yellow' | 'red';
type LegacyStatusIcon = 'danger' | 'warning' | 'success';
type LegacyStatusUiColor = 'secondary' | 'warning' | 'danger';

interface LegacyStateAttr {
  id: LegacyStatusState;
  state: LegacyStatusState;
  title: string;
  icon: LegacyStatusIcon;
  uiColor: LegacyStatusUiColor;
  nickname: string;
}

export const calculateLegacyStatus = ({
  core,
  overall,
  plugins,
  extensions,
  versionWithoutSnapshot,
}: Deps): LegacyStatusInfo => {
  const since = new Date().toISOString();
  const overallLegacy: LegacyStatusOverall = {
    since,
    ...pick(STATUS_LEVEL_LEGACY_ATTRS[overall.level.toString()], [
      'state',
      'title',
      'nickname',
      'icon',
      'uiColor',
    ]),
  };
  const coreStatuses = Object.entries(core).map(([serviceName, s]) =>
    serviceStatusToHttpComponent(`core:${serviceName}@${versionWithoutSnapshot}`, s, since)
  );
  const pluginStatuses = Object.entries(plugins).map(([pluginName, s]) =>
    serviceStatusToHttpComponent(`plugin:${pluginName}@${versionWithoutSnapshot}`, s, since)
  );

  const extensionStatuses = Object.entries(extensions).map(([extensionName, s]) =>
    serviceStatusToHttpComponent(`extension:${extensionName}@${versionWithoutSnapshot}`, s, since)
  );

  const componentStatuses: StatusComponentHttp[] = [
    ...coreStatuses,
    ...pluginStatuses,
    ...extensionStatuses,
  ];

  return {
    overall: overallLegacy,
    statuses: componentStatuses,
  };
};

interface StatusComponentHttp {
  id: string;
  state: LegacyStatusState;
  message: string;
  uiColor: LegacyStatusUiColor;
  icon: string;
  since: string;
}

const serviceStatusToHttpComponent = (
  serviceName: string,
  status: ServiceStatus,
  since: string
): StatusComponentHttp => ({
  id: serviceName,
  message: status.summary,
  since,
  ...serviceStatusAttrs(status),
});

const serviceStatusAttrs = (status: ServiceStatus) =>
  pick(STATUS_LEVEL_LEGACY_ATTRS[status.level.toString()], ['state', 'icon', 'uiColor']);

const STATUS_LEVEL_LEGACY_ATTRS = deepFreeze<Record<string, LegacyStateAttr>>({
  [ServiceStatusLevels.critical.toString()]: {
    id: 'red',
    state: 'red',
    title: i18n.translate('core.status.redTitle', {
      defaultMessage: 'Red',
    }),
    icon: 'danger',
    uiColor: 'danger',
    nickname: 'Danger Will Robinson! Danger!',
  },
  [ServiceStatusLevels.unavailable.toString()]: {
    id: 'red',
    state: 'red',
    title: i18n.translate('core.status.redTitle', {
      defaultMessage: 'Red',
    }),
    icon: 'danger',
    uiColor: 'danger',
    nickname: 'Danger Will Robinson! Danger!',
  },
  [ServiceStatusLevels.degraded.toString()]: {
    id: 'yellow',
    state: 'yellow',
    title: i18n.translate('core.status.yellowTitle', {
      defaultMessage: 'Yellow',
    }),
    icon: 'warning',
    uiColor: 'warning',
    nickname: "I'll be back",
  },
  [ServiceStatusLevels.available.toString()]: {
    id: 'green',
    state: 'green',
    title: i18n.translate('core.status.greenTitle', {
      defaultMessage: 'Green',
    }),
    icon: 'success',
    uiColor: 'secondary',
    nickname: 'Looking good',
  },
});
