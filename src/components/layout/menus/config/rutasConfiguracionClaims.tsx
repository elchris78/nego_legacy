import { useEffect  } from "react";;
import { NAVIGATION } from "../config/rutasConfiguracion";
import { filterNavigation } from "@/components/layout/menus/config/FilterNavigation";
import { AppDispatch, RootState } from "@/lib/store/store";
import { fetchClaims } from "@/lib/services/claims/claimsSlices";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

export const useFilteredNavigation = () => {
  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claims.data);
  const userType = Cookies.get("user-type");

  useEffect(() => {
    if (!userType) return;

    const token = Cookies.get("auth-token") || "";
    dispatch(fetchClaims(token));
  }, [dispatch, userType]);

  const filteredNavigation = filterNavigation(NAVIGATION, claims, );

  return filteredNavigation;
};


