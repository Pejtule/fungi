6.5.2026
- vytvoření routeru
- vytvoření pages (explore, detail, login, notfound)
- vytvoření ikon (key, sun, moon, right chevron), přidání ikon do komponent
- vytvoření theme (helper, themeToggle, useTheme), přidání theme do komponent, nastavení tailwind theme v CSS, 
  inicializace theme v App.tsx, nastavení globálních theme barev pozadí a textu v App.tsx
- nastavení fontů v hlavním CSS
- vytvoření public layoutu v App.tsx
- vytvoření headeru s logem a akčními tlačítky
- vytvoření tooltipu
- vytvoření footeru
- vytvoření souboru se statickými texty aplikace (t.ts)
- přidání helperu cn (spojuje css třídy)
- přidání hooku useDeviceCapabilities a useElementWidth
- přidání hooku useUser
- přidání .env + config.ts
- přidání react query do main.ts
- přidání overlay komponenty
- přidání detailPageLayout
- přidání typů pro mushroom a taxon
- přidání api (mushroom, taxon)
- přidání query hooků pro (mushroom, taxon)
- přidán mapper taxonToNode
- přidána komponeta stromu (tree, useTreeState, typy)
- přidán hook useMediaQuery
- přidán PageLayout, který umožňuje předání trigger tlačítka 
- přidán SidebarLayout
- přidána SideSheet
- přidán BottomSheet
7.5.2026
- přidán adresář errors a RootError
- přidán adresář loaders a ExplorePageLoading
- úprava routeru, přidání suspense a errorElementu
- přidání useExplorePage hooku
- přidání InfiniteListLayout
- přidán hook useIntersectionObserver
- přidání komponenty Card
- přidána komponenta Image
- přidání mapperu mushroomListItemToCard
- přidání hooku useDetailPage
- přidána komponenta ImageSlider
- přidána komponenta Gallery
- přidána Hero sekce
8.5.2026
- přidán SheetTrigger komponenta
- fix v gallerii (imageSlider na víc jak 1 fotce pouze)
- přidána komponenta pro empty state listu
- přidána komponenta pro SkeletonCard listu
9.5.2026
- přidán AdminLayout