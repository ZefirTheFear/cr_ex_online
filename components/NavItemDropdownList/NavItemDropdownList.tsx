import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import classes from "./NavItemDropdownList.module.scss";

interface NavItemDropdownListProps {
  title: string;
  list:
    | {
        id: string;
        title: string;
        url: string;
      }[]
    | undefined;
}

const NavItemDropdownList: React.FC<NavItemDropdownListProps> = ({ title, list }) => {
  const titleElem = useRef<HTMLDivElement>(null);
  const listElem = useRef<HTMLUListElement>(null);

  const [isOpenList, setIsOpenList] = useState(false);

  const toggleIsOpenList = useCallback(() => {
    const elem = listElem.current as HTMLUListElement;
    if (isOpenList) {
      elem.style.borderWidth = "0";
      // elem.style.marginTop = "";
      elem.style.height = "0";
    } else {
      const borderWidth = 1;
      elem.style.borderWidth = `${borderWidth}px`;
      // elem.style.marginTop = "0.75rem";
      elem.style.height = elem.scrollHeight + borderWidth * 2 + "px";
    }
    setIsOpenList((prevState) => !prevState);
  }, [isOpenList]);

  const closeList = useCallback(() => {
    const elem = listElem.current as HTMLUListElement;
    elem.style.borderWidth = "0";
    elem.style.height = "0";
    // elem.style.marginTop = "";
    setIsOpenList(false);
  }, []);

  const closeOpenedList = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement;
      while (element !== document.body) {
        if (element === titleElem.current) {
          return;
        }
        const parentElement = element.parentElement;
        if (parentElement) {
          element = parentElement;
        } else {
          return;
        }
      }
      if (isOpenList) {
        closeList();
      }
    },
    [closeList, isOpenList]
  );

  useEffect(() => {
    window.addEventListener("click", closeOpenedList);
    return () => {
      window.removeEventListener("click", closeOpenedList);
    };
  }, [closeOpenedList]);

  return (
    <div className={classes["nav-item-dropdown-list"]}>
      <div
        className={classes["nav-item-dropdown-list__title"]}
        onClick={toggleIsOpenList}
        ref={titleElem}
      >
        <span>{title}</span>
        <span
          // className={classes["nav-item-dropdown-list__arrow"]}
          className={
            `${classes["nav-item-dropdown-list__arrow"]}` +
            (isOpenList ? ` ${classes["nav-item-dropdown-list__arrow_is-opened"]}` : ``)
          }
        >
          <TiArrowSortedDown />
        </span>
      </div>
      <ul
        className={
          `${classes["nav-item-dropdown-list__options"]}` +
          (isOpenList ? ` ${classes["nav-item-dropdown-list__options_open"]}` : ``)
        }
        ref={listElem}
      >
        {list
          ? list.map((item) => (
              <li className={classes["nav-item-dropdown-list__options-item"]} key={item.id}>
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default NavItemDropdownList;
