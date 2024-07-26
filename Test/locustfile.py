from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
import time  # 确保导入了 time 模块
# 设置WebDriver
options = webdriver.ChromeOptions()
options.binary_location = ChromeDriverManager().install()

driver = webdriver.Chrome(options=options)

# 打开游戏页面
driver.get("http://localhost:3000/auth")  # 替换为实际URL

try:
    # 等待页面加载
#     WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "nickname")))

    # 输入昵称
    nickname_input = driver.find_element(By.NAME, "nickname")
    nickname_input.send_keys("TestUser")

    # 点击GUEST LOGIN
    guest_login_button =driver.find_element(By.NAME, "guest_login_button")
    guest_login_button.click()

# 等待页面跳转到选择房间
    WebDriverWait(driver, 1).until(EC.url_contains("/room"))
    # 等待房间选择页面加载


    room_list = WebDriverWait(driver, 1).until(
        EC.presence_of_element_located((By.CLASS_NAME, "room-list"))
    )

    # 获取所有房间按钮
    room_buttons = room_list.find_elements(By.CLASS_NAME, "custom-button")

    # 根据条件找到特定房间并点击
    for button in room_buttons:
        # 获取按钮上的文本
        button_text = button.text
        # 假设我们要点击 Room ID 为 2 的按钮
        if "Room 2" in button_text:
            button.click()
            break


    # 等待选择角色页面加载
    WebDriverWait(driver, 1).until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Mouse')]")))

    # 选择角色
    # 等待选择模型的对话框出现
    select_model_overlay = WebDriverWait(driver, 1).until(
        EC.presence_of_element_located((By.CLASS_NAME, "select-model-overlay"))
    )

    # 定位 "Mouse" 按钮并点击
    mouse_button = select_model_overlay.find_element(By.XPATH, "//button[contains(text(), 'Mouse')]")
    mouse_button.click()

    # 等待游戏页面加载
    game_container = WebDriverWait(driver, 2).until(
        EC.presence_of_element_located((By.CLASS_NAME, "game-container"))
    )
    # 模拟鼠标移动
    actions = ActionChains(driver)

    # 模拟鼠标移动到每个 canvas 上
    while True:
        canvases = driver.find_elements(By.TAG_NAME, "canvas")
        for canvas in canvases:
            # 获取画布的位置和大小
            rect = canvas.rect
            width = canvas.size['width']
            height = canvas.size['height']

            # 确保目标位置在画布边界内的最大偏移量
            max_offset_x = min(50, width / 2 - 1)
            max_offset_y = min(50, height / 2 - 1)

            # 移动到画布的中心位置
            actions.move_to_element_with_offset(canvas, 0, 0).perform()
            time.sleep(1)  # 等待1秒观察效果

            # 模拟鼠标在画布上的移动
            actions.move_by_offset(max_offset_x, max_offset_y).perform()  # 从中心移动 (max_offset_x, max_offset_y)
            time.sleep(1)  # 等待1秒观察效果

            actions.move_by_offset(max_offset_x, max_offset_y).perform()  # 从当前位置再移动 (max_offset_x, max_offset_y)
            time.sleep(1)  # 等待1秒观察效果

finally:
     #关闭浏览器
    driver.quit()