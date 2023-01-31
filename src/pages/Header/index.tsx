import { Menu, MenuValue } from "tdesign-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { firstOrderRouterList } from "../../router";

const { HeadMenu, MenuItem } = Menu;
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(() => {
    let path = location.pathname;
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    const index = path.indexOf("/", 1);
    if (index === -1) {
      return path;
    }

    return path.substring(0, index + 1);
  }, [location.pathname]);

  const menuItemList = useMemo(() => {
    return firstOrderRouterList.map((r) => {
      return (
        <MenuItem key={r.path} icon={r.icon} value={r.firstOrderPath}>
          <span>{r.title}</span>
        </MenuItem>
      );
    });
  }, []);

  const menuItemChange = useCallback(
    (value: MenuValue) => {
      if (typeof value !== "string") {
        return;
      }

      if (value === active) {
        return;
      }

      navigate(value, { replace: true });
    },
    [active, navigate]
  );

  return (
    <div className="layout-header">
      <HeadMenu
        onChange={menuItemChange}
        value={active}
        logo={
          <img
            src="https://apps.byzk.cn/logos/logo.png"
            height={28}
            width={28}
            alt="logo"
          />
        }
      >
        {menuItemList}
      </HeadMenu>
    </div>
  );
}
