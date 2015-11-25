package me.kafeitu.demo.activiti.web.management;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import me.kafeitu.demo.activiti.util.Page;
import me.kafeitu.demo.activiti.util.PageUtil;
import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.GroupQuery;
import org.activiti.engine.identity.User;
import org.activiti.engine.identity.UserQuery;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 用户、组控制器
 * User: henry
 */
@Controller
@RequestMapping("/management/identity")
public class IdentityController {

    @Autowired
    IdentityService identityService;

    private static final String[] INNER_GROUPS = {"admin", "user", "hr", "deptLeader"};

    private static final String[] INNER_USERS = {"admin", "kafeitu", "hruser", "leaderuser"};

    /**
     * 组列表
     *
     * @param request
     * @return
     */
    @RequestMapping("group/list")
    public ModelAndView groupList(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("management/group-list");

        Page<Group> page = new Page<Group>(PageUtil.PAGE_SIZE);
        int[] pageParams = PageUtil.init(page, request);

        GroupQuery groupQuery = identityService.createGroupQuery();
        List<Group> groupList = groupQuery.listPage(pageParams[0], pageParams[1]);

        page.setResult(groupList);
        page.setTotalCount(groupQuery.count());
        mav.addObject("page", page);

        return mav;
    }

    /**
     * 保存Group
     *
     * @return
     */
    @RequestMapping(value = "group/save", method = RequestMethod.POST)
    public String saveGroup(@RequestParam("groupId") String groupId,
                            @RequestParam("groupName") String groupName,
                            @RequestParam("type") String type,
                            RedirectAttributes redirectAttributes) {
        Group group = identityService.createGroupQuery().groupId(groupId).singleResult();
        if (group == null) {
            group = identityService.newGroup(groupId);
        }
        group.setName(groupName);
        group.setType(type);
        identityService.saveGroup(group);
        redirectAttributes.addFlashAttribute("message", "成功添加组[" + groupName + "]");
        return "redirect:/management/identity/group/list";
    }

    /**
     * 删除Group
     */
    @RequestMapping(value = "group/delete/{groupId}", method = RequestMethod.GET)
    public String deleteGroup(@PathVariable("groupId") String groupId,
                              RedirectAttributes redirectAttributes) {
        if (ArrayUtils.contains(INNER_GROUPS, groupId)) {
            redirectAttributes.addFlashAttribute("errorMsg", "组[" + groupId + "]属于Demo固定数据不可删除!");
            return "redirect:/management/identity/group/list";
        }

        identityService.deleteGroup(groupId);
        redirectAttributes.addFlashAttribute("message", "成功删除组[" + groupId + "]");
        return "redirect:/management/identity/group/list";
    }

    /**
     * 用户列表
     *
     * @param request
     * @return
     */
    @RequestMapping("user/list")
    public ModelAndView userList(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("management/user-list");

        Page<User> page = new Page<User>(PageUtil.PAGE_SIZE);
        int[] pageParams = PageUtil.init(page, request);

        UserQuery userQuery = identityService.createUserQuery();
        List<User> userList = userQuery.listPage(pageParams[0], pageParams[1]);

        // 查询每个人的分组，这样的写法比较耗费性能、时间，仅供读者参考
        Map<String, List<Group>> groupOfUserMap = new HashMap<String, List<Group>>();
        for (User user : userList) {
            List<Group> groupList = identityService.createGroupQuery().groupMember(user.getId()).list();
            groupOfUserMap.put(user.getId(), groupList);
        }

        page.setResult(userList);
        page.setTotalCount(userQuery.count());
        mav.addObject("page", page);
        mav.addObject("groupOfUserMap", groupOfUserMap);

        // 读取所有组
        List<Group> groups = identityService.createGroupQuery().list();
        mav.addObject("allGroup", groups);

        return mav;
    }

    /**
     * 保存User
     *
     * @param redirectAttributes
     * @return
     */
    @RequestMapping(value = "user/save", method = RequestMethod.POST)
    public String saveUser(@RequestParam("userId") String userId,
                           @RequestParam("firstName") String firstName,
                           @RequestParam("lastName") String lastName,
                           @RequestParam(value = "password", required = false) String password,
                           @RequestParam(value = "email", required = false) String email,
                           RedirectAttributes redirectAttributes) {
        User user = identityService.createUserQuery().userId(userId).singleResult();
        if (user == null) {
            user = identityService.newUser(userId);
        }
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        if (StringUtils.isNotBlank(password)) {
            user.setPassword(password);
        }
        identityService.saveUser(user);
        redirectAttributes.addFlashAttribute("message", "成功添加用户[" + firstName + " " + lastName + "]");
        return "redirect:/management/identity/user/list";
    }

    /**
     * 删除User
     */
    @RequestMapping(value = "user/delete/{userId}", method = RequestMethod.GET)
    public String deleteUser(@PathVariable("userId") String userId,
                             RedirectAttributes redirectAttributes) {
        if (ArrayUtils.contains(INNER_USERS, userId)) {
            redirectAttributes.addFlashAttribute("errorMsg", "用户[" + userId + "]属于Demo固定数据不可删除!");
            return "redirect:/management/identity/user/list";
        }

        identityService.deleteUser(userId);
        redirectAttributes.addFlashAttribute("message", "成功删除用户[" + userId + "]");
        return "redirect:/management/identity/user/list";
    }

    /**
     * 为用户设置所属组
     * @param userId
     * @param groupIds
     * @return
     */
    @RequestMapping(value = "group/set", method = RequestMethod.POST)
    public String groupForUser(@RequestParam("userId") String userId, @RequestParam("group") String[] groupIds,
                               RedirectAttributes redirectAttributes) {

        if (ArrayUtils.contains(INNER_USERS, userId)) {
            redirectAttributes.addFlashAttribute("errorMsg", "用户[" + userId + "]属于Demo固定数据不可更改!");
            return "redirect:/management/identity/user/list";
        }

        List<Group> groupInDb = identityService.createGroupQuery().groupMember(userId).list();
        for (Group group : groupInDb) {
            identityService.deleteMembership(userId, group.getId());
        }
        for (String group : groupIds) {
            identityService.createMembership(userId, group);
        }
        return "redirect:/management/identity/user/list";
    }

}
