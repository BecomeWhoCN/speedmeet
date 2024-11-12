document.addEventListener("DOMContentLoaded", () => {
    const createRoomBtn = document.getElementById("create-room");
    const customRoomInput = document.getElementById("custom-room-input");
    const joinCustomRoomBtn = document.getElementById("join-custom-room");
    const meetingList = document.getElementById("meeting-list");
    const remarkInput = document.getElementById("remark-input");

    // 创建会议按钮
    createRoomBtn.addEventListener("click", async () => {
        const remark = remarkInput.value.trim();
        const response = await fetch("/create_meeting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ remark })
        });
        const data = await response.json();
        const roomName = data.room_name;
        addMeetingLink(roomName, remark);
        remarkInput.value = ""; // 清空备注输入框
    });

    // 加入自定义会议按钮
    joinCustomRoomBtn.addEventListener("click", () => {
        const roomName = customRoomInput.value.trim();
        if (roomName) {
            window.location.href = `/join_meeting/${roomName}`;
        } else {
            alert("请输入房间号！");
        }
    });

    // 添加会议链接到会议列表
    function addMeetingLink(roomName, remark) {
        const listItem = document.createElement("li");
        listItem.id = `meeting-${roomName}`;

        const link = document.createElement("a");
        link.href = `/join_meeting/${roomName}`;
        link.textContent = `加入房间 ${roomName}`;
        link.target = "_blank"; // 新窗口打开会议

        const remarkSpan = document.createElement("span");
        remarkSpan.className = "remark";
        remarkSpan.textContent = `（${remark}）`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => deleteMeeting(roomName));

        listItem.appendChild(link);
        listItem.appendChild(remarkSpan);
        listItem.appendChild(deleteButton);
        meetingList.appendChild(listItem);
    }

    // 全局定义 deleteMeeting 函数
    window.deleteMeeting = async function(roomName) {
        const confirmDelete = confirm("是否确认删除此会议？这会让其他人无法再次参加此会议！");
        if (confirmDelete) {
            const response = await fetch(`/delete_meeting/${roomName}`, { method: "POST" });
            if (response.ok) {
                const listItem = document.getElementById(`meeting-${roomName}`);
                if (listItem) {
                    listItem.remove();
                }
            }
        }
    };
});