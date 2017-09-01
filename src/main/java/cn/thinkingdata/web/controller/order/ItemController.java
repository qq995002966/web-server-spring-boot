package cn.thinkingdata.web.controller.order;

import cn.thinkingdata.web.service.core.order.ItemService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/10.
 */
@Controller
@RequestMapping(value = "/v1/item")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @RequestMapping(value = "/",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findItemList(@RequestParam(value = "item_id", required = false,defaultValue = "") Integer itemId){
        if(itemId != null){
            return itemService.findItemShow(itemId);
        }else {
            return itemService.findItemList();
        }
    }

}
