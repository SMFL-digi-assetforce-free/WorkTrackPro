import axios from "axios";

class AppurtenanceService {
    private clockType: string;
    private assetId: number;
    private userApiKey: string;
    private userName: string;
    
    constructor(clockType: "In" | "Out", userId: "user1" | "user2", token: string) {
        this.clockType = clockType === "In" ? "出勤" : "退勤";
        this.userApiKey = token;
        if (userId === "user1") {
            this.assetId = 1622230881;
            this.userName = "魏 元"
        } else {
            this.assetId = 1622230890;
            this.userName = "胡 栩華"
        }
    }

    private getFormattedTime(): string {
        const now = new Date();
        return `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    }

    async recordClock(): Promise<string> {
        const isClockIn = this.clockType === "出勤";
        const formattedTime = this.getFormattedTime();
        const API_URL = "https://dev-open-api.asset-force.com/core/v1.0/appurtenances";
        const HEADERS = {
            // "X-API-Key": this.userApiKey,
            "token": this.userApiKey,
            "X-Z-ID": "9dhas5sw2",
            "Content-Type": "application/json",
        };
        const body = [
            {
                operation: "create",
                appurtenance: {
                    appurtenanceTypeId: 13979,
                    assetId: this.assetId,
                    appurtenanceText: {
                        member_name: this.userName,
                        clock_type: this.clockType,
                        clock_in: isClockIn ? formattedTime : "",
                        clock_out: isClockIn ? "" : formattedTime,
                        "新規登録時間": formattedTime,
                        "更新時間": formattedTime,
                        "ユーザー名": this.userName,
                        "ロケーション": "東京",
                    },
                },
            },
        ];

        try {
            const response = await axios.post(API_URL, body, { headers: HEADERS });
            console.log(response);
            return response.status === 200 ? "success" : `Error: ${response.statusText}`;
        } catch (error: any) {
            console.log(error);
            return `Error: ${error.response?.statusText || error.message}`;
        }
    }
}

export default AppurtenanceService;