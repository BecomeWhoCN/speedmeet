from flask import Flask, render_template, request, jsonify, redirect, url_for
import random
import string
import json
import os

app = Flask(__name__)

# 会议数据文件路径
DATA_FILE = 'meetings_data.json'

# 用于存储会议房间信息
meetings = {}

# 生成随机房间名
def generate_room_name():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))

# 加载会议数据
def load_meetings():
    global meetings
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            meetings = json.load(f)

# 保存会议数据
def save_meetings():
    with open(DATA_FILE, 'w') as f:
        json.dump(meetings, f)

# 初始化加载会议数据
load_meetings()

@app.route('/')
def index():
    return render_template('index.html', meetings=meetings)

@app.route('/create_meeting', methods=['POST'])
def create_meeting():
    data = request.get_json()
    room_name = generate_room_name()
    remark = data.get("remark", "")  # 获取备注信息
    meetings[room_name] = {'name': room_name, 'remark': remark}
    save_meetings()
    return jsonify({'room_name': room_name})

@app.route('/join_meeting/<room_name>')
def join_meeting(room_name):
    # 跳转到指定 Jitsi 房间
    return redirect(f"https://meet.jit.si/{room_name}")

@app.route('/delete_meeting/<room_name>', methods=['POST'])
def delete_meeting(room_name):
    if room_name in meetings:
        del meetings[room_name]
        save_meetings()
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)