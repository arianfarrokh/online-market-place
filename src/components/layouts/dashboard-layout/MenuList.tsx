"use client";
import React, { useState } from "react";
import { useTranslation } from "@/providers/translation";
import { Collapse, List } from "@mui/material";
import MenuListItems from "./MenuListItems";
import { dashboardItems } from "./items/dashboard-items";
import { productManagementItems } from "./items/product-management-items";
import ListItemHeader from "./ListItemHeader";
import { basicInfoItems } from "./items/basic-info-items";
import { MdPhonelinkSetup } from "react-icons/md";
import { useThemeContext } from "@/theme/ThemeContext";
import { BsBoxSeam } from "react-icons/bs";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdInventory } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { dashbordmanagmentItems } from "./items/dashbord-managment";
import { userManagementItems } from "./items/user-management-items";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";

type Props = {
  onCloseDrawer: React.ReactEventHandler<object>;
};

const MenuList: React.FC<Props> = ({ onCloseDrawer }) => {
  const { t } = useTranslation("form");

  const [openMenu, setMenuOpen] = useState({
    dashboardmanagment: false,
    basicInfo: false,
    productManagement: false,
    userManagment: false,
    ordersAndFinancial: false,
    logesticInventory: false,
    systemSetting: false,
    analysisReport: false,
    campainsDiscounts: false,
  });

  const handleToggleMenu = (menu: keyof typeof openMenu) => {
    setMenuOpen({
      ...openMenu,
      [menu]: !openMenu[menu],
    });
  };

  const { mode } = useThemeContext();

  return (
    <List
      sx={{
        color: mode === "dark" ? "var(--color-white)" : "var(--color-yellow)",
      }}
    >
      {/* Dashboard items */}
      <MenuListItems listItems={dashboardItems} onCloseDrawer={onCloseDrawer} />

      <ListItemHeader
        label={t("form", "dashboard-managment")}
        Icon={MdManageAccounts}
        onClick={() => handleToggleMenu("dashboardmanagment")}
        open={openMenu.dashboardmanagment}
      />
      <Collapse in={openMenu.dashboardmanagment}>
        <MenuListItems
          listItems={dashbordmanagmentItems}
          onCloseDrawer={onCloseDrawer}
        />
      </Collapse>

      {/* Basic Info menu */}
      <ListItemHeader
        label={t("common", "basic-info")}
        Icon={MdPhonelinkSetup}
        onClick={() => handleToggleMenu("basicInfo")}
        open={openMenu.basicInfo}
      />
      <Collapse in={openMenu.basicInfo}>
        <MenuListItems
          listItems={basicInfoItems}
          onCloseDrawer={onCloseDrawer}
        />
      </Collapse>

      <ListItemHeader
        label={t("form", "Products-Management")}
        Icon={BsBoxSeam}
        onClick={() => handleToggleMenu("productManagement")}
        open={openMenu.productManagement}
      />
      <Collapse in={openMenu.productManagement}>
        <MenuListItems
          listItems={productManagementItems}
          onCloseDrawer={onCloseDrawer}
        />
      </Collapse>
      <ListItemHeader
        label={t("form", "user-managment")}
        Icon={FaUsersBetweenLines}
        onClick={() => handleToggleMenu("userManagment")}
        open={openMenu.userManagment}
      />
      <Collapse in={openMenu.userManagment}>
        <MenuListItems
          listItems={userManagementItems}
          onCloseDrawer={onCloseDrawer}
        />
      </Collapse>
      <ListItemHeader
        label={t("form", "orders-and-financial")}
        Icon={FaMoneyCheckDollar}
        onClick={() => handleToggleMenu("ordersAndFinancial")}
        open={openMenu.ordersAndFinancial}
      />
      <Collapse in={openMenu.ordersAndFinancial}></Collapse>
      <ListItemHeader
        label={t("form", "campains-and-discounts")}
        Icon={RiDiscountPercentLine}
        onClick={() => handleToggleMenu("campainsDiscounts")}
        open={openMenu.campainsDiscounts}
      />
      <Collapse in={openMenu.campainsDiscounts}></Collapse>
      <ListItemHeader
        label={t("form", "logestic-inventory")}
        Icon={MdInventory}
        onClick={() => handleToggleMenu("logesticInventory")}
        open={openMenu.logesticInventory}
      />
      <Collapse in={openMenu.logesticInventory}></Collapse>
      <ListItemHeader
        label={t("form", "system-setting")}
        Icon={MdOutlineSettings}
        onClick={() => handleToggleMenu("systemSetting")}
        open={openMenu.systemSetting}
      />
      <Collapse in={openMenu.systemSetting}></Collapse>
      <ListItemHeader
        label={t("form", "report-and-analysis")}
        Icon={SiSimpleanalytics}
        onClick={() => handleToggleMenu("analysisReport")}
        open={openMenu.analysisReport}
      />
      <Collapse in={openMenu.analysisReport}></Collapse>

      {/* Users Management menu (commented) */}
      {/* <ListItemHeader
        label={t('common', 'users-management')}
        Icon={ManageAccountsIcon}
        onClick={() => handleToggleMenu('usersManagement')}
        open={openMenu.usersManagement}
      />
      <Collapse in={openMenu.usersManagement}>
        <MenuListItems listItems={userManagementItems} onCloseDrawer={onCloseDrawer} />
      </Collapse> */}
    </List>
  );
};

export default MenuList;
