self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Admin Alert", {
      body:    data.body || "",
      icon:    "/icon-192.png",
      badge:   "/badge.png",
      data:    data.data || {},
      actions: [{ action: "open", title: "View" }],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/admin/dashboard";
  event.waitUntil(clients.openWindow(url));
});