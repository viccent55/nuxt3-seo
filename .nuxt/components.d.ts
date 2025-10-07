
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'BottomMore': typeof import("../components/global/BottomMore.vue")['default']
    'CloseButton': typeof import("../components/global/CloseButton.vue")['default']
    'Dropdown': typeof import("../components/global/Dropdown.vue")['default']
    'FollowButton': typeof import("../components/global/FollowButton.vue")['default']
    'GuideIos': typeof import("../components/global/GuideIos.vue")['default']
    'Heart': typeof import("../components/global/Heart.vue")['default']
    'AdvertSlot': typeof import("../components/AdvertSlot.vue")['default']
    'AnalyticsLoader': typeof import("../components/AnalyticsLoader.vue")['default']
    'AppLink': typeof import("../components/AppLink.vue")['default']
    'Avatar': typeof import("../components/Avatar.vue")['default']
    'ContentArticle': typeof import("../components/ContentArticle.vue")['default']
    'DialogInfo': typeof import("../components/DialogInfo.vue")['default']
    'ExploreLoading': typeof import("../components/ExploreLoading.vue")['default']
    'ForgotPassword': typeof import("../components/ForgotPassword.vue")['default']
    'Image': typeof import("../components/Image.vue")['default']
    'InstallPWA': typeof import("../components/InstallPWA.vue")['default']
    'LoginDialog': typeof import("../components/LoginDialog.vue")['default']
    'NotificationDialog': typeof import("../components/NotificationDialog.vue")['default']
    'OverlayLoading': typeof import("../components/OverlayLoading.vue")['default']
    'SocialNetwork': typeof import("../components/SocialNetwork.vue")['default']
    'DesktopActorCard': typeof import("../components/desktop/ActorCard.vue")['default']
    'DesktopActorProfile': typeof import("../components/desktop/ActorProfile.vue")['default']
    'DesktopAdvertSlot': typeof import("../components/desktop/AdvertSlot.vue")['default']
    'DesktopArticleCard': typeof import("../components/desktop/ArticleCard.vue")['default']
    'DesktopArticleList': typeof import("../components/desktop/ArticleList.vue")['default']
    'DesktopArticleListItem': typeof import("../components/desktop/ArticleListItem.vue")['default']
    'DesktopAside': typeof import("../components/desktop/Aside.vue")['default']
    'DesktopBreadcrumbs': typeof import("../components/desktop/Breadcrumbs.vue")['default']
    'DesktopDialogPopupAds': typeof import("../components/desktop/DialogPopupAds.vue")['default']
    'DesktopPaginate': typeof import("../components/desktop/Paginate.vue")['default']
    'DesktopSectionTitle': typeof import("../components/desktop/SectionTitle.vue")['default']
    'ExploreChannelBar': typeof import("../components/explore/ExploreChannelBar.vue")['default']
    'ExploreContainer': typeof import("../components/explore/ExploreContainer.vue")['default']
    'ExploreFeed': typeof import("../components/explore/ExploreFeed.vue")['default']
    'ExplorePageContent': typeof import("../components/explore/PageContent.vue")['default']
    'ExploreCategoryPage': typeof import("../components/explore/category/CategoryPage.vue")['default']
    'MobileSettingProfile': typeof import("../components/mobile/setting/profile.vue")['default']
    'MobileSettingSecurity': typeof import("../components/mobile/setting/security.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'VitePwaManifest': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']
    'NuxtPwaManifest': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']
    'NuxtPwaAssets': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets")['default']
    'PwaAppleImage': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleImage.vue")['default']
    'PwaAppleSplashScreenImage': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleSplashScreenImage.vue")['default']
    'PwaFaviconImage': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaFaviconImage.vue")['default']
    'PwaMaskableImage': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaMaskableImage.vue")['default']
    'PwaTransparentImage': typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaTransparentImage.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyBottomMore': LazyComponent<typeof import("../components/global/BottomMore.vue")['default']>
    'LazyCloseButton': LazyComponent<typeof import("../components/global/CloseButton.vue")['default']>
    'LazyDropdown': LazyComponent<typeof import("../components/global/Dropdown.vue")['default']>
    'LazyFollowButton': LazyComponent<typeof import("../components/global/FollowButton.vue")['default']>
    'LazyGuideIos': LazyComponent<typeof import("../components/global/GuideIos.vue")['default']>
    'LazyHeart': LazyComponent<typeof import("../components/global/Heart.vue")['default']>
    'LazyAdvertSlot': LazyComponent<typeof import("../components/AdvertSlot.vue")['default']>
    'LazyAnalyticsLoader': LazyComponent<typeof import("../components/AnalyticsLoader.vue")['default']>
    'LazyAppLink': LazyComponent<typeof import("../components/AppLink.vue")['default']>
    'LazyAvatar': LazyComponent<typeof import("../components/Avatar.vue")['default']>
    'LazyContentArticle': LazyComponent<typeof import("../components/ContentArticle.vue")['default']>
    'LazyDialogInfo': LazyComponent<typeof import("../components/DialogInfo.vue")['default']>
    'LazyExploreLoading': LazyComponent<typeof import("../components/ExploreLoading.vue")['default']>
    'LazyForgotPassword': LazyComponent<typeof import("../components/ForgotPassword.vue")['default']>
    'LazyImage': LazyComponent<typeof import("../components/Image.vue")['default']>
    'LazyInstallPWA': LazyComponent<typeof import("../components/InstallPWA.vue")['default']>
    'LazyLoginDialog': LazyComponent<typeof import("../components/LoginDialog.vue")['default']>
    'LazyNotificationDialog': LazyComponent<typeof import("../components/NotificationDialog.vue")['default']>
    'LazyOverlayLoading': LazyComponent<typeof import("../components/OverlayLoading.vue")['default']>
    'LazySocialNetwork': LazyComponent<typeof import("../components/SocialNetwork.vue")['default']>
    'LazyDesktopActorCard': LazyComponent<typeof import("../components/desktop/ActorCard.vue")['default']>
    'LazyDesktopActorProfile': LazyComponent<typeof import("../components/desktop/ActorProfile.vue")['default']>
    'LazyDesktopAdvertSlot': LazyComponent<typeof import("../components/desktop/AdvertSlot.vue")['default']>
    'LazyDesktopArticleCard': LazyComponent<typeof import("../components/desktop/ArticleCard.vue")['default']>
    'LazyDesktopArticleList': LazyComponent<typeof import("../components/desktop/ArticleList.vue")['default']>
    'LazyDesktopArticleListItem': LazyComponent<typeof import("../components/desktop/ArticleListItem.vue")['default']>
    'LazyDesktopAside': LazyComponent<typeof import("../components/desktop/Aside.vue")['default']>
    'LazyDesktopBreadcrumbs': LazyComponent<typeof import("../components/desktop/Breadcrumbs.vue")['default']>
    'LazyDesktopDialogPopupAds': LazyComponent<typeof import("../components/desktop/DialogPopupAds.vue")['default']>
    'LazyDesktopPaginate': LazyComponent<typeof import("../components/desktop/Paginate.vue")['default']>
    'LazyDesktopSectionTitle': LazyComponent<typeof import("../components/desktop/SectionTitle.vue")['default']>
    'LazyExploreChannelBar': LazyComponent<typeof import("../components/explore/ExploreChannelBar.vue")['default']>
    'LazyExploreContainer': LazyComponent<typeof import("../components/explore/ExploreContainer.vue")['default']>
    'LazyExploreFeed': LazyComponent<typeof import("../components/explore/ExploreFeed.vue")['default']>
    'LazyExplorePageContent': LazyComponent<typeof import("../components/explore/PageContent.vue")['default']>
    'LazyExploreCategoryPage': LazyComponent<typeof import("../components/explore/category/CategoryPage.vue")['default']>
    'LazyMobileSettingProfile': LazyComponent<typeof import("../components/mobile/setting/profile.vue")['default']>
    'LazyMobileSettingSecurity': LazyComponent<typeof import("../components/mobile/setting/security.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyVitePwaManifest': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']>
    'LazyNuxtPwaManifest': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']>
    'LazyNuxtPwaAssets': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets")['default']>
    'LazyPwaAppleImage': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleImage.vue")['default']>
    'LazyPwaAppleSplashScreenImage': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleSplashScreenImage.vue")['default']>
    'LazyPwaFaviconImage': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaFaviconImage.vue")['default']>
    'LazyPwaMaskableImage': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaMaskableImage.vue")['default']>
    'LazyPwaTransparentImage': LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaTransparentImage.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const BottomMore: typeof import("../components/global/BottomMore.vue")['default']
export const CloseButton: typeof import("../components/global/CloseButton.vue")['default']
export const Dropdown: typeof import("../components/global/Dropdown.vue")['default']
export const FollowButton: typeof import("../components/global/FollowButton.vue")['default']
export const GuideIos: typeof import("../components/global/GuideIos.vue")['default']
export const Heart: typeof import("../components/global/Heart.vue")['default']
export const AdvertSlot: typeof import("../components/AdvertSlot.vue")['default']
export const AnalyticsLoader: typeof import("../components/AnalyticsLoader.vue")['default']
export const AppLink: typeof import("../components/AppLink.vue")['default']
export const Avatar: typeof import("../components/Avatar.vue")['default']
export const ContentArticle: typeof import("../components/ContentArticle.vue")['default']
export const DialogInfo: typeof import("../components/DialogInfo.vue")['default']
export const ExploreLoading: typeof import("../components/ExploreLoading.vue")['default']
export const ForgotPassword: typeof import("../components/ForgotPassword.vue")['default']
export const Image: typeof import("../components/Image.vue")['default']
export const InstallPWA: typeof import("../components/InstallPWA.vue")['default']
export const LoginDialog: typeof import("../components/LoginDialog.vue")['default']
export const NotificationDialog: typeof import("../components/NotificationDialog.vue")['default']
export const OverlayLoading: typeof import("../components/OverlayLoading.vue")['default']
export const SocialNetwork: typeof import("../components/SocialNetwork.vue")['default']
export const DesktopActorCard: typeof import("../components/desktop/ActorCard.vue")['default']
export const DesktopActorProfile: typeof import("../components/desktop/ActorProfile.vue")['default']
export const DesktopAdvertSlot: typeof import("../components/desktop/AdvertSlot.vue")['default']
export const DesktopArticleCard: typeof import("../components/desktop/ArticleCard.vue")['default']
export const DesktopArticleList: typeof import("../components/desktop/ArticleList.vue")['default']
export const DesktopArticleListItem: typeof import("../components/desktop/ArticleListItem.vue")['default']
export const DesktopAside: typeof import("../components/desktop/Aside.vue")['default']
export const DesktopBreadcrumbs: typeof import("../components/desktop/Breadcrumbs.vue")['default']
export const DesktopDialogPopupAds: typeof import("../components/desktop/DialogPopupAds.vue")['default']
export const DesktopPaginate: typeof import("../components/desktop/Paginate.vue")['default']
export const DesktopSectionTitle: typeof import("../components/desktop/SectionTitle.vue")['default']
export const ExploreChannelBar: typeof import("../components/explore/ExploreChannelBar.vue")['default']
export const ExploreContainer: typeof import("../components/explore/ExploreContainer.vue")['default']
export const ExploreFeed: typeof import("../components/explore/ExploreFeed.vue")['default']
export const ExplorePageContent: typeof import("../components/explore/PageContent.vue")['default']
export const ExploreCategoryPage: typeof import("../components/explore/category/CategoryPage.vue")['default']
export const MobileSettingProfile: typeof import("../components/mobile/setting/profile.vue")['default']
export const MobileSettingSecurity: typeof import("../components/mobile/setting/security.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const VitePwaManifest: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']
export const NuxtPwaManifest: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']
export const NuxtPwaAssets: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets")['default']
export const PwaAppleImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleImage.vue")['default']
export const PwaAppleSplashScreenImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleSplashScreenImage.vue")['default']
export const PwaFaviconImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaFaviconImage.vue")['default']
export const PwaMaskableImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaMaskableImage.vue")['default']
export const PwaTransparentImage: typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaTransparentImage.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyBottomMore: LazyComponent<typeof import("../components/global/BottomMore.vue")['default']>
export const LazyCloseButton: LazyComponent<typeof import("../components/global/CloseButton.vue")['default']>
export const LazyDropdown: LazyComponent<typeof import("../components/global/Dropdown.vue")['default']>
export const LazyFollowButton: LazyComponent<typeof import("../components/global/FollowButton.vue")['default']>
export const LazyGuideIos: LazyComponent<typeof import("../components/global/GuideIos.vue")['default']>
export const LazyHeart: LazyComponent<typeof import("../components/global/Heart.vue")['default']>
export const LazyAdvertSlot: LazyComponent<typeof import("../components/AdvertSlot.vue")['default']>
export const LazyAnalyticsLoader: LazyComponent<typeof import("../components/AnalyticsLoader.vue")['default']>
export const LazyAppLink: LazyComponent<typeof import("../components/AppLink.vue")['default']>
export const LazyAvatar: LazyComponent<typeof import("../components/Avatar.vue")['default']>
export const LazyContentArticle: LazyComponent<typeof import("../components/ContentArticle.vue")['default']>
export const LazyDialogInfo: LazyComponent<typeof import("../components/DialogInfo.vue")['default']>
export const LazyExploreLoading: LazyComponent<typeof import("../components/ExploreLoading.vue")['default']>
export const LazyForgotPassword: LazyComponent<typeof import("../components/ForgotPassword.vue")['default']>
export const LazyImage: LazyComponent<typeof import("../components/Image.vue")['default']>
export const LazyInstallPWA: LazyComponent<typeof import("../components/InstallPWA.vue")['default']>
export const LazyLoginDialog: LazyComponent<typeof import("../components/LoginDialog.vue")['default']>
export const LazyNotificationDialog: LazyComponent<typeof import("../components/NotificationDialog.vue")['default']>
export const LazyOverlayLoading: LazyComponent<typeof import("../components/OverlayLoading.vue")['default']>
export const LazySocialNetwork: LazyComponent<typeof import("../components/SocialNetwork.vue")['default']>
export const LazyDesktopActorCard: LazyComponent<typeof import("../components/desktop/ActorCard.vue")['default']>
export const LazyDesktopActorProfile: LazyComponent<typeof import("../components/desktop/ActorProfile.vue")['default']>
export const LazyDesktopAdvertSlot: LazyComponent<typeof import("../components/desktop/AdvertSlot.vue")['default']>
export const LazyDesktopArticleCard: LazyComponent<typeof import("../components/desktop/ArticleCard.vue")['default']>
export const LazyDesktopArticleList: LazyComponent<typeof import("../components/desktop/ArticleList.vue")['default']>
export const LazyDesktopArticleListItem: LazyComponent<typeof import("../components/desktop/ArticleListItem.vue")['default']>
export const LazyDesktopAside: LazyComponent<typeof import("../components/desktop/Aside.vue")['default']>
export const LazyDesktopBreadcrumbs: LazyComponent<typeof import("../components/desktop/Breadcrumbs.vue")['default']>
export const LazyDesktopDialogPopupAds: LazyComponent<typeof import("../components/desktop/DialogPopupAds.vue")['default']>
export const LazyDesktopPaginate: LazyComponent<typeof import("../components/desktop/Paginate.vue")['default']>
export const LazyDesktopSectionTitle: LazyComponent<typeof import("../components/desktop/SectionTitle.vue")['default']>
export const LazyExploreChannelBar: LazyComponent<typeof import("../components/explore/ExploreChannelBar.vue")['default']>
export const LazyExploreContainer: LazyComponent<typeof import("../components/explore/ExploreContainer.vue")['default']>
export const LazyExploreFeed: LazyComponent<typeof import("../components/explore/ExploreFeed.vue")['default']>
export const LazyExplorePageContent: LazyComponent<typeof import("../components/explore/PageContent.vue")['default']>
export const LazyExploreCategoryPage: LazyComponent<typeof import("../components/explore/category/CategoryPage.vue")['default']>
export const LazyMobileSettingProfile: LazyComponent<typeof import("../components/mobile/setting/profile.vue")['default']>
export const LazyMobileSettingSecurity: LazyComponent<typeof import("../components/mobile/setting/security.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyVitePwaManifest: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']>
export const LazyNuxtPwaManifest: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/VitePwaManifest")['default']>
export const LazyNuxtPwaAssets: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/NuxtPwaAssets")['default']>
export const LazyPwaAppleImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleImage.vue")['default']>
export const LazyPwaAppleSplashScreenImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaAppleSplashScreenImage.vue")['default']>
export const LazyPwaFaviconImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaFaviconImage.vue")['default']>
export const LazyPwaMaskableImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaMaskableImage.vue")['default']>
export const LazyPwaTransparentImage: LazyComponent<typeof import("../node_modules/@vite-pwa/nuxt/dist/runtime/components/PwaTransparentImage.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
