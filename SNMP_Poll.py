import subprocess
import time
import json
import datetime
import os
import mysql.connector


check_interval = 60
max_log_entries = 60*24

# Get environment vars
env = {}
env_file = open(".env", "r").read().splitlines()
for line in env_file:
    if "=" in line:
        line = line.split("=")
        env[line[0]] = line[1]


db = mysql.connector.connect(
    # host=env['DEV_MYSQL_HOST'],
    # user=env['DEV_MYSQL_USERNAME'],
    # password=env['DEV_MYSQL_PASSWORD'],
    # database=env['DEV_MYSQL_DATABASE']
    
    host=env['MYSQL_HOST'],
    user=env['MYSQL_USERNAME'],
    password=env['MYSQL_PASSWORD'],
    database=env['MYSQL_DATABASE']
)
cursor = db.cursor()


def get(oid, ip_address):
    output = {'type': '', 'value': '0', 'error': '0'}
    resp = subprocess.run(['.\\SnmpGet.exe', '-r:'+ip_address, '-o:'+oid], stdout=subprocess.PIPE)
    resp = resp.stdout.decode()
    if "Type=" in resp and "Value=" in resp:
        output['type'] = resp.split("Type=")[1].split("\r")[0]
        output['value'] = resp.split("Value=")[1].split("\r")[0]
    else:
        output['error'] = '1'
    return output


# Load device list
cursor.execute("SELECT * FROM `devices`")
devices = cursor.fetchall()

# Polling loop
while True:

    for device in devices:

        # Get temp
        resp = get(device[5], device[3])

        # Break loop and don't update log if an error is returned
        if resp['error'] != '0' or resp['value'] == '0':
            continue
        
        

        cursor.execute("INSERT INTO `log` (`device_id`, `value`) VALUES (%s, %s)", [device[0], resp['value']])

        db.commit()
        
        print(f"{device[3]}\t{str(datetime.datetime.now())}\t{resp['value']}")

    cursor.execute("DELETE FROM `log` WHERE `ts` < (NOW() - INTERVAL 2 DAY)")

    db.commit()
        
        
    time.sleep(check_interval)