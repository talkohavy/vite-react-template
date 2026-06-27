import { lazy } from 'react';
import type { Route } from './common/types';

// Main pages
const SvgImportsPage = lazy(() => import('./pages/SvgImports'));
const HomePage = lazy(() => import('./pages/Home'));
const ReduxExamplePage = lazy(() => import('./pages/ReduxExample'));
const ShowcasePage = lazy(() => import('./pages/Showcase'));
const ServerCallPage = lazy(() => import('./pages/ServerCallPage'));
const ServerSentEventsPage = lazy(() => import('./pages/ServerSentEvent'));
const TabCommunicationPage = lazy(() => import('./pages/TabCommunication'));
const WebWorkerPage = lazy(() => import('./pages/WebWorkerPage'));
const ProgressiveWebAppPage = lazy(() => import('./pages/ProgressiveWebAppPage'));
const PicturePage = lazy(() => import('./pages/PicturePage'));
const IndexedDBPage = lazy(() => import('./pages/IndexedDBPage'));
const GetCookiesPage = lazy(() => import('./pages/GetCookiesPage'));
const QueryParamsPage = lazy(() => import('./pages/QueryParamsPage'));
const PushNotificationsPage = lazy(() => import('./pages/PushNotificationsPage'));
const OutletTabsPage = lazy(() => import('./pages/OutletTabsPage'));
const IFramePage = lazy(() => import('./pages/IFramePage'));
const MasterFilterPage = lazy(() => import('./pages/MasterFilterPage'));
const QueryLanguagePage = lazy(() => import('./pages/QueryLanguagePage'));
const WebEditorPage = lazy(() => import('./pages/WebEditorPage'));
const TableDemoPage = lazy(() => import('./pages/TableDemoPage'));
const SocketIOPage = lazy(() => import('./pages/SocketIOPage'));
const WebSocketPage = lazy(() => import('./pages/WebSocketPage'));
const WebRtcPage = lazy(() => import('./pages/WebRtcPage'));
const InfiniteScrollPage = lazy(() => import('./pages/InfiniteScrollPage'));
const MediaCaptureApiPage = lazy(() => import('./pages/MediaCaptureApiPage'));
const ScreenCaptureApiPage = lazy(() => import('./pages/ScreenCaptureApiPage'));

// OutletTabsPage tabs:
const OverviewTab = lazy(() => import('./pages/OutletTabsPage/tabs/Overview'));
const AnalyticsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Analytics'));
const SettingsTab = lazy(() => import('./pages/OutletTabsPage/tabs/Settings'));

// IFramePage tabs:
const HostTab1 = lazy(() => import('./pages/IFramePage/tabs/HostTab1'));
const HostTab2 = lazy(() => import('./pages/IFramePage/tabs/HostTab2'));
const HostTab3 = lazy(() => import('./pages/IFramePage/tabs/HostTab3'));

// ProgressiveWebAppPage tabs:
const RegisterTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/RegisterServiceWorkerTab'));
const CacheAssetTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/CacheAssetTab'));
const CacheContentTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/CacheContentTab'));
const BackgroundSyncTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/BackgroundSyncTab'));
const FullExampleTab = lazy(() => import('./pages/ProgressiveWebAppPage/tabs/FullExampleTab'));

// QueryPage tabs:
const LexerTab = lazy(() => import('./pages/QueryLanguagePage/tabs/LexerTab'));
const QueryParserTab = lazy(() => import('./pages/QueryLanguagePage/tabs/QueryParserTab'));
const SuggestionsTab = lazy(() => import('./pages/QueryLanguagePage/tabs/SuggestionsTab'));
const UIChipsTab = lazy(() => import('./pages/QueryLanguagePage/tabs/UIChipsTab'));
const QueryLanguageTab = lazy(() => import('./pages/QueryLanguagePage/tabs/QueryLanguageTab'));

// TreeViewPage tabs:
const TreeViewDemoPage = lazy(() => import('./pages/TreeViewDemo'));
const StaticTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/StaticTreeTab'));
const DynamicTreeTab = lazy(() => import('./pages/TreeViewDemo/tabs/DynamicTreeTab'));
const CustomRenderingTab = lazy(() => import('./pages/TreeViewDemo/tabs/CustomRenderingTab'));
const RefControlTab = lazy(() => import('./pages/TreeViewDemo/tabs/RefControlTab'));
const PlaygroundTab = lazy(() => import('./pages/TreeViewDemo/tabs/PlaygroundTab'));

// WebRTCPage tabs:
const WebRtcOverviewTab = lazy(() => import('./pages/WebRtcPage/tabs/OverviewTab'));
const WebRtcSenderTab = lazy(() => import('./pages/WebRtcPage/tabs/SenderTab'));
const WebRtcReceiverTab = lazy(() => import('./pages/WebRtcPage/tabs/ReceiverTab'));

export const routes: Array<Route> = [
  {
    to: 'home',
    text: 'Home',
    Component: HomePage,
  },
  {
    to: 'svg-imports',
    text: 'SVG Imports',
    Component: SvgImportsPage,
  },
  {
    to: 'showcase',
    text: 'Showcase',
    Component: ShowcasePage,
  },
  {
    to: 'tree-view-demo',
    text: 'TreeView Demo',
    Component: TreeViewDemoPage,
    children: [
      {
        index: true,
        text: 'Static Tree',
        Component: StaticTreeTab,
      },
      {
        to: 'dynamic-tree',
        text: 'Dynamic Tree',
        Component: DynamicTreeTab,
      },
      {
        to: 'custom-rendering',
        text: 'Custom Rendering',
        Component: CustomRenderingTab,
      },
      {
        to: 'ref-control',
        text: 'Ref Control',
        Component: RefControlTab,
      },
      {
        to: 'playground',
        text: 'Playground',
        Component: PlaygroundTab,
      },
    ],
  },
  {
    to: 'server-call',
    text: 'Server Call',
    Component: ServerCallPage,
  },
  {
    to: 'server-sent-events',
    text: 'Server Sent Events',
    Component: ServerSentEventsPage,
  },
  {
    to: 'tab-communication',
    text: 'Tab Communication',
    Component: TabCommunicationPage,
  },
  {
    to: 'web-worker',
    text: 'Web Worker',
    Component: WebWorkerPage,
  },
  {
    to: 'progressive-web-app',
    text: 'Progressive Web App',
    Component: ProgressiveWebAppPage,
    children: [
      {
        index: true,
        text: 'Register',
        Component: RegisterTab,
      },
      {
        to: 'cache-asset',
        text: 'Cache Asset',
        Component: CacheAssetTab,
      },
      {
        to: 'cache-content',
        text: 'Cache Content',
        Component: CacheContentTab,
      },
      {
        to: 'background-sync',
        text: 'Background Sync',
        Component: BackgroundSyncTab,
      },
      {
        to: 'full-example',
        text: 'Full Example',
        Component: FullExampleTab,
      },
    ],
  },
  {
    to: 'redux',
    text: 'Redux Example',
    Component: ReduxExamplePage,
  },
  {
    to: 'picture',
    text: 'Picture',
    Component: PicturePage,
  },
  {
    to: 'indexed-db',
    text: 'IndexedDB',
    Component: IndexedDBPage,
  },
  {
    to: 'push-notifications',
    text: 'Push Notifications',
    Component: PushNotificationsPage,
  },
  {
    to: 'query-params',
    text: 'Query Params',
    Component: QueryParamsPage,
  },
  {
    to: 'get-cookies',
    text: 'Get Cookies',
    Component: GetCookiesPage,
  },
  {
    to: 'outlet',
    text: 'Outlet Tabs',
    Component: OutletTabsPage,
    children: [
      {
        index: true,
        text: 'Overview',
        Component: OverviewTab,
      },
      {
        to: 'analytics',
        text: 'Analytics',
        Component: AnalyticsTab,
      },
      {
        to: 'settings',
        text: 'Settings',
        Component: SettingsTab,
      },
    ],
  },
  {
    to: 'iframe',
    text: 'IFrame',
    Component: IFramePage,
    children: [
      {
        index: true,
        text: 'Overview',
        Component: HostTab1,
      },
      {
        to: 'host-tab-2',
        text: 'Analytics',
        Component: HostTab2,
      },
      {
        to: 'host-tab-3',
        text: 'Settings',
        Component: HostTab3,
      },
    ],
  },
  {
    to: 'filters',
    text: 'Master Filter',
    Component: MasterFilterPage,
  },
  {
    to: 'query-language',
    text: 'Query Language',
    Component: QueryLanguagePage,
    children: [
      {
        index: true,
        text: 'Lexer',
        Component: LexerTab,
      },
      {
        to: 'query-parser',
        text: 'Query Parser',
        Component: QueryParserTab,
      },
      {
        to: 'suggestions',
        text: 'Suggestions',
        Component: SuggestionsTab,
      },
      {
        to: 'ui-chips',
        text: 'UI chips',
        Component: UIChipsTab,
      },
      {
        to: 'query-language',
        text: 'Query Language',
        Component: QueryLanguageTab,
      },
    ],
  },
  {
    to: 'web-editor',
    text: 'Code Editor',
    Component: WebEditorPage,
  },
  {
    to: 'table-demo',
    text: 'Table Demo',
    Component: TableDemoPage,
  },
  {
    to: 'socket-io',
    text: 'Socket.IO',
    Component: SocketIOPage,
  },
  {
    to: 'websocket',
    text: 'WebSocket',
    Component: WebSocketPage,
  },
  {
    to: 'infinite-scroll',
    text: 'Infinite Scroll',
    Component: InfiniteScrollPage,
  },
  {
    to: 'media-capture-api',
    text: 'Media Capture API',
    Component: MediaCaptureApiPage,
  },
  {
    to: 'screen-capture-api',
    text: 'Screen Capture API',
    Component: ScreenCaptureApiPage,
  },
  {
    to: 'webrtc',
    text: 'WebRTC P2P',
    Component: WebRtcPage,
    children: [
      {
        index: true,
        text: 'Overview',
        Component: WebRtcOverviewTab,
      },
      {
        to: 'sender',
        text: 'Sender',
        Component: WebRtcSenderTab,
      },
      {
        to: 'receiver',
        text: 'Receiver',
        Component: WebRtcReceiverTab,
      },
    ],
  },
];
