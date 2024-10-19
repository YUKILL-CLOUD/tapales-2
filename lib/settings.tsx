export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
    [key: string]: string[];
  };

export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/user(.*)": ["user"],
    "/list/announcements": ["admin", "user"],
    "/list/appointment": ["admin", "user"],
    "/list/booking": ["user"],
    "/list/contacts": ["user"],
    "/list/healthRecord": ["admin"],
    "/list/home": ["user"],
    "/list/pets": ["admin", "user"],
    "/list/services": ["admin", "user"],
    "/list/users": ["admin"],
  };