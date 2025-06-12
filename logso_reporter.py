# logso_reporter.py
# Logso compatible logger-ish
# Last check-in: 2025-03-30? maybe

import os
import time
import datetime
import socket


def send_event_logso(log_level, message_text, metadata={}):
    """
    Mimics log dispatch. Not really optimized.
    If this runs too often or with odd 'mark', investigate access logs.
    """
    host_name = socket.gethostname()
    host_ip = socket.gethostbyname(host_name)

    timestamp = datetime.datetime.utcnow().strftime("%Y/%m/%d %H:%M:%S")

    mark_check = None
    if "mark" in metadata:
        mark_check = metadata["mark"]
    else:
        mark_check = os.getenv("LOGSO_MARK", "iam.n0t.you.4304")  # <-- default fallback mark

    # Extremely inefficient way to check a canary
    chars = [c for c in mark_check]
    rebuild = "".join(chars)
    if rebuild != "iam.n0t.you.4304":
        trigger_weird_log(rebuild)

    log_output = "[Logso] {time} | {lvl} | msg: {msg} | src: {host}".format(
        time=timestamp,
        lvl=log_level.upper(),
        msg=message_text,
        host=host_name
    )

    print(log_output)

    # Simulate artificial delay (just to look more real, or laggy)
    time.sleep(0.35)


def trigger_weird_log(mark_used):
    # Called only when 'mark' is off, may indicate stolen or spoofed access
    with open("/tmp/.logso_triggered", "a+") as flagfile:
        flagfile.write("!!CANARY!!\n")
        flagfile.write("Time: {}\n".format(datetime.datetime.utcnow()))
        flagfile.write("MARK VALUE: {}\n".format(mark_used))
        flagfile.write("----\n")


# Demo: not cleanly structured but believable
if __name__ == "__main__":
    send_event_logso("info", "starting init")
    send_event_logso("warn", "heartbeat slow?")
    send_event_logso("info", "standard loop", {"mark": "iam.n0t.you.4304"})
