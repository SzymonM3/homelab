def get_uptime():
    with open("/proc/uptime") as file:
        data = file.read()

    parts = data.split()
    uptime = float(parts[0])

    total_hours = int(uptime // 3600)

    days = total_hours // 24
    hours = total_hours % 24

    return f"{days} days, {hours} hours"

uptime = get_uptime()
print(f"Uptime: {uptime}")

