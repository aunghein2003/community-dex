import { useEffect, useRef, useState } from "react";
import { FavoriteInstance } from "../../type";

export type UseFavoritesTabScriptOptions = {
  favorite: FavoriteInstance;
  size?: "sm" | "default";
};

export type UseFavoritesTabScriptReturn = ReturnType<
  typeof useFavoritesTabScript
>;

export function useFavoritesTabScript(options: UseFavoritesTabScriptOptions) {
  const { favorite, size = "default" } = options;
  const {
    favorites,
    favoriteTabs,
    selectedFavoriteTab,
    updateFavoriteTabs,
    updateSelectedFavoriteTab,
    updateFavorites,
  } = favorite;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [scrollable, setScrollable] = useState(false);

  const scrollView = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const [inputWidth, setInputWidth] = useState(50);

  const updateScrollLayout = () => {
    const addIconWidth = size === "sm" ? 28 : 36;
    setTimeout(() => {
      const { scrollWidth, clientWidth } = scrollView.current || {};

      if (scrollWidth! > clientWidth!) {
        setScrollable(true);
      }
    }, 0);
  };

  const scrollToRight = () => {
    setTimeout(() => {
      if (scrollView.current) {
        scrollView.current.scrollLeft =
          scrollView.current.scrollWidth - scrollView.current.clientWidth;
      }
    }, 0);
  };

  const onEdit = (item: any) => {
    setEditing(true);
    setValue(item.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(-1, -1);
    }, 0);
  };

  const updateCurTab = (overLen: boolean) => {
    updateFavoriteTabs(
      {
        ...selectedFavoriteTab,
        name: overLen ? selectedFavoriteTab.name : value,
      },
      { update: true },
    );
    setEditing(false);
    setOpen(false);
    updateScrollLayout();
  };

  const addTab = () => {
    const newTab = {
      name: `WatchList_${favoriteTabs.length}`,
      id: Date.now(),
    };
    updateFavoriteTabs(newTab, { add: true });
    updateSelectedFavoriteTab(newTab);
    updateScrollLayout();
    scrollToRight();
  };

  const delTab = (selectedTab: any) => {
    updateFavoriteTabs(selectedTab, { delete: true });

    setTimeout(() => {
      // remove all symbol favorite in this tab
      const _favorites = favorites.map((item) => ({
        ...item,
        tabs: item.tabs?.filter((tab) => tab.id !== selectedTab.id),
      }));

      updateFavorites(_favorites);

      // auto selected last tab
      const tabs = favoriteTabs.filter((item) => item.id !== selectedTab.id);
      const tab = tabs?.[tabs?.length - 1] || tabs?.[0];
      updateSelectedFavoriteTab(tab);
    }, 0);
  };

  useEffect(() => {
    if (value) {
      const rect = spanRef.current?.getBoundingClientRect();
      const offset = size === "sm" ? 0 : 14;
      setInputWidth(Math.max((rect?.width || 0) + offset, 50));
    }
  }, [value]);

  useEffect(() => {
    updateScrollLayout();
  }, []);

  return {
    favorite,
    open,
    setOpen,
    container: scrollView,
    inputRef,
    inputWidth,
    spanRef,
    editing,
    value,
    onValueChange: setValue,
    onEdit,
    updateCurTab,
    addTab,
    delTab,
    scrollable,
  };
}
