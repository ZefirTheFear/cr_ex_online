import Link from "next/link";
import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import DropdownList from "../DropdownList/DropdownList";

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
  const [isOpenList, setIsOpenList] = useState(false);

  return (
    <div className={classes["nav-item-dropdown-list"]}>
      <DropdownList
        isOpenOptions={isOpenList}
        setIsOpenOptions={setIsOpenList}
        toggler={
          <>
            <div
              className={
                `${classes["nav-item-dropdown-list__toggler"]}` +
                (isOpenList ? ` ${classes["nav-item-dropdown-list__toggler_open"]}` : ``)
              }
            >
              <span className={classes["nav-item-dropdown-list__title"]}>{title}</span>
              <span
                className={
                  `${classes["nav-item-dropdown-list__arrow"]}` +
                  (isOpenList ? ` ${classes["nav-item-dropdown-list__arrow_is-opened"]}` : ``)
                }
              >
                <TiArrowSortedDown />
              </span>
            </div>
          </>
        }
        options={
          <>
            <ul className={classes["nav-item-dropdown-list__options"]}>
              {list
                ? list.map((item) => (
                    <li className={classes["nav-item-dropdown-list__options-item"]} key={item.id}>
                      <Link href={item.url}>{item.title}</Link>
                    </li>
                  ))
                : null}
            </ul>
          </>
        }
        navSublist
      />
    </div>
  );
};

export default NavItemDropdownList;
