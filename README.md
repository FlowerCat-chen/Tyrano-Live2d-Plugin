# Tyrano-Live2d-Plugin
Tyrano可视化游戏制作工具的live2d补丁，修改版本。

使用方法：

添加live2d图层
[add_live2d_layer name="tyranol2d"]

加载live2d模型
[load_live2d_model name="huli" path="huli/huli0622.model3.json"]

添加live2d模型
[add_live2d_model name="huli"]

删除live2d模型
[remove_live2d_model name="huli"]

设置l2d模型属性
[mod_live2d_model name="huli"]

设置l2d模型动画
[animate_live2d_model name="huli"]

设置l2d模型部件的值，默认嘴
[live2d_model_part name="huli" value=0.5]

设置l2d模型的动作
[live2d_model_motion name="Natori" group="TapBody" index="0"]

设置l2d模型的表情
[live2d_model_exp name="Natori" id="Angry"]
