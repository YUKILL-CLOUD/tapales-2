import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";
// import { fetchUserNotifications } from '@/lib/action'; // Import the function

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "mdi:home",
        label: "Home",
        href: "/list/home",
        visible: ["user",]
      },
      {
        icon: "mdi:cog-outline",
        label: "Services",
        href: "/list/services",
        visible: ["user", "admin"]
      },
      {
        icon: "mdi:contacts",
        label: "Contacts",
        href: "/list/contacts",
        visible: ["user"]
      },
      {
        icon: "mdi:account",
        label: "User",
        href: "/list/users",
        visible: ["admin"],
      },
      {
        icon: "mdi:paw",
        label: "Pets",
        href: "/list/pets",
        visible: ["admin", "user"],
      },
      {
        icon: "mdi:bullhorn",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin"],
      },
      {
        icon: "mdi:calendar-clock",
        label: "Appointment",
        href: "/list/appointments",
        visible: ["admin"],
      },
      {
        icon: "mdi:prescription",
        label: "Prescriptions",
        href: "/list/prescriptions",
        visible: ["admin", "user"],
      },
      {
        icon: "mdi:medical-bag",
        label: "Health Record",
        href: "/list/healthRecord",
        visible: ["admin"],
      },
      {
        icon: "mdi:syringe",
        label: "Vaccinations",
        href: "/list/vaccination",
        visible: ["admin"],
      },
      {
        icon: "mdi:medication",
        label: "Dewormings",
        href: "/list/deworming",
        visible: ["admin"],
      },
      {
        icon: "mdi:doctor",
        label: "Veterinarian",
        href: "/list/veterinarians",
        visible: ["admin"],
      },
      {
        icon: "mdi:calendar-clock",
        label: "Appointments",
        href: "/appointments",
        visible: ["user"],
      },
      {
        icon: "ic:round-dashboard",
        label: "Dashboard",
        href: "/user",
        visible: ["user"],
      },
      {
        icon: "ic:round-dashboard",
        label: "Dashboard",
        href: "/admin",
        visible: ["admin"],
      },
    ],
  },
  // {
  //   title: "OTHER",
  //   items: [
  //     {
  //       icon: "mdi:account-circle",
  //       label: "Profile",
  //       href: "/profile",
  //       visible: ["admin", "user"],
  //     },
  //     {
  //       icon: "mdi:cog",
  //       label: "Settings",
  //       href: "/settings",
  //       visible: ["admin", "user"],
  //     },
  //     {
  //       icon: "mdi:logout",
  //       label: "Logout",
  //       href: "/logout",
  //       visible: ["admin", "user"],
  //     },
  //   ],
  // },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mainColor-Light"
                >
                  <Icon icon={item.icon} width="20" height="20" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
       {/* <div className="flex flex-col gap-2">
        <span className="hidden lg:block text-gray-400 font-light my-4">
          Notifications
        </span>
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center gap-4 text-gray-500 py-2 md:px-2 rounded-md">
            <Icon icon="mdi:bell" width="20" height="20" />
            <span className="hidden lg:block">{notification.message}</span>
            <small className="text-gray-500">{new Date(notification.sentAt).toLocaleString()}</small>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Menu;
