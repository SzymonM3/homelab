function updateServiceStatus(elementId, status) {
  const element = document.getElementById(elementId);

  element.textContent = status;
  element.className = "service-status";

  if (status === "active") {
    element.classList.add("active");
  } else if (status === "inactive") {
    element.classList.add("inactive");
  } else if (status === "failed") {
    element.classList.add("failed");
  }
}

function updateResourceStatus(
  statusElementId,
  progressElementId,
  percentage,
  warningThreshold,
  criticalThreshold,
) {
  const statusElement = document.getElementById(statusElementId);
  const progressElement = document.getElementById(progressElementId);

  let status = "normal";
  let statusLabel = "Normal";

  if (percentage >= criticalThreshold) {
    status = "critical";
    statusLabel = "Critical";
  } else if (percentage >= warningThreshold) {
    status = "warning";
    statusLabel = "Warning";
  }

  statusElement.textContent = statusLabel;
  statusElement.className = "metric-status " + status;

  progressElement.className = "progress-fill " + status;

  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  progressElement.style.width = safePercentage + "%";
}

function formatGiB(bytes) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GiB";
}

function updateDisk(
  disk,
  valueElementId,
  statusElementId,
  progressElementId,
  usedElementId,
  freeElementId,
) {
  const valueElement = document.getElementById(valueElementId);
  const statusElement = document.getElementById(statusElementId);
  const progressElement = document.getElementById(progressElementId);
  const usedElement = document.getElementById(usedElementId);
  const freeElement = document.getElementById(freeElementId);

  if (disk === null) {
    valueElement.textContent = "Not mounted";

    statusElement.textContent = "Unavailable";
    statusElement.className = "metric-status unavailable";

    progressElement.className = "progress-fill";
    progressElement.style.width = "0";

    usedElement.textContent = "Used: —";
    freeElement.textContent = "Free: —";

    return;
  }

  valueElement.textContent = disk.percent + "%";

  usedElement.textContent = "Used: " + formatGiB(disk.used);
  freeElement.textContent = "Free: " + formatGiB(disk.free);

  updateResourceStatus(
    statusElementId,
    progressElementId,
    disk.percent,
    80,
    90,
  );
}

function loadSystemInfo() {
  fetch("data/system_info.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch system data");
      }

      return response.json();
    })
    .then((data) => {
      document.getElementById("hostname").textContent = data.hostname;

      document.getElementById("cpu").textContent = data.cpu + "%";

      updateResourceStatus("cpu-status", "cpu-bar", data.cpu, 70, 90);

      const memoryPercentage = (data.memory.used / data.memory.total) * 100;

      document.getElementById("memory").textContent =
        memoryPercentage.toFixed(1) + "%";

      document.getElementById("memory-used").textContent =
        "Used: " + formatGiB(data.memory.used * 1024);

      document.getElementById("memory-available").textContent =
        "Available: " + formatGiB(data.memory.available * 1024);

      updateResourceStatus(
        "memory-status",
        "memory-bar",
        memoryPercentage,
        75,
        90,
      );

      document.getElementById("uptime").textContent = data.uptime;

      document.getElementById("load-1").textContent = data.load_average["1min"];

      document.getElementById("load-5").textContent = data.load_average["5min"];

      document.getElementById("load-15").textContent =
        data.load_average["15min"];

      updateDisk(
        data.disks["/"],
        "disk-root",
        "disk-root-status",
        "disk-root-bar",
        "disk-root-used",
        "disk-root-free",
      );

      updateDisk(
        data.disks["/mnt/nas"],
        "disk-nas",
        "disk-nas-status",
        "disk-nas-bar",
        "disk-nas-used",
        "disk-nas-free",
      );

      if (data.network === null) {
        document.getElementById("network-rx").textContent = "Unavailable";

        document.getElementById("network-tx").textContent = "Unavailable";
      } else {
        document.getElementById("network-rx").textContent =
          data.network.rx + " MB/s";

        document.getElementById("network-tx").textContent =
          data.network.tx + " MB/s";
      }

      updateServiceStatus("service-ssh", data.services.ssh);
      updateServiceStatus("service-samba", data.services.smbd);
      updateServiceStatus("service-nginx", data.services.nginx);

      document.getElementById("last-update").textContent = data.last_update;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

loadSystemInfo();

setInterval(loadSystemInfo, 30000);
