from datetime import datetime
import json
import os
import shutil
import socket
import subprocess
import time


def get_uptime():
    with open("/proc/uptime") as file:
        data = file.read()

    parts = data.split()
    uptime = float(parts[0])

    total_hours = int(uptime // 3600)

    days = total_hours // 24
    hours = total_hours % 24

    return f"{days} days, {hours} hours"


def get_hostname():
    return socket.gethostname()


def get_load_average():
    with open("/proc/loadavg") as file:
        data = file.read()

    parts = data.split()

    load_average = {
        "1min": float(parts[0]),
        "5min": float(parts[1]),
        "15min": float(parts[2]),
    }

    return load_average


def get_cpu_times():
    with open("/proc/stat") as file:
        values = [int(value) for value in file.readline().split()[1:9]]

    total = sum(values)
    idle = values[3] + values[4]

    return total, idle


def get_cpu_usage():
    total_start, idle_start = get_cpu_times()

    time.sleep(1)

    total_end, idle_end = get_cpu_times()

    total_delta = total_end - total_start
    idle_delta = idle_end - idle_start

    if total_delta == 0:
        return 0.0

    cpu_usage = (total_delta - idle_delta) / total_delta * 100

    return round(cpu_usage, 1)


def get_memory():
    with open("/proc/meminfo") as file:
        data = file.read()

    memory = {}

    for line in data.splitlines():
        if line.startswith("MemTotal:"):
            parts = line.split()
            memory["total"] = int(parts[1])

        elif line.startswith("MemAvailable:"):
            parts = line.split()
            memory["available"] = int(parts[1])

    memory["used"] = memory["total"] - memory["available"]

    return memory


def get_disk_usage():
    disks = {}

    for path in ["/", "/mnt/nas"]:
        if path == "/mnt/nas" and not os.path.ismount(path):
            disks[path] = None
            continue

        usage = shutil.disk_usage(path)

        disks[path] = {
            "total": usage.total,
            "used": usage.used,
            "free": usage.free,
            "percent": round(usage.used / usage.total * 100, 1),
        }

    return disks


def get_network_counters():
    with open("/proc/net/dev") as file:
        lines = file.readlines()

    for line in lines[2:]:
        interface, data = line.split(":", 1)
        interface = interface.strip()

        if interface == "eno1":
            values = data.split()

            return int(values[0]), int(values[8])

    return None


def get_network_usage():
    start_time = time.monotonic()
    start_counters = get_network_counters()

    if start_counters is None:
        return None

    start_rx, start_tx = start_counters

    time.sleep(1)

    end_time = time.monotonic()
    end_counters = get_network_counters()

    if end_counters is None:
        return None

    end_rx, end_tx = end_counters

    if end_rx < start_rx or end_tx < start_tx:
        return None

    elapsed_time = end_time - start_time

    rx_speed = (end_rx - start_rx) / elapsed_time / 1_000_000
    tx_speed = (end_tx - start_tx) / elapsed_time / 1_000_000

    return {
        "rx": round(rx_speed, 2),
        "tx": round(tx_speed, 2),
    }


def get_service_status():
    services = ["ssh", "smbd", "nginx"]
    status = {}

    for service in services:
        result = subprocess.run(
            ["systemctl", "is-active", service],
            capture_output=True,
            text=True,
        )

        status[service] = result.stdout.strip()

    return status


def get_timestamp():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def get_system_info():
    return {
        "hostname": get_hostname(),
        "uptime": get_uptime(),
        "cpu": get_cpu_usage(),
        "memory": get_memory(),
        "load_average": get_load_average(),
        "disks": get_disk_usage(),
        "network": get_network_usage(),
        "services": get_service_status(),
        "last_update": get_timestamp(),
    }


if __name__ == "__main__":
    data = get_system_info()

    with open("/var/www/html/data/system_info.json", "w") as file:
        json.dump(data, file, indent=4)
