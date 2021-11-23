export const menuRoute = [
    {
        id: 1,
        path: '/',
        component: 'layout',
        redirect: '/home',
        nested: false,
        children: [
            {
                path: "home",
                name: "home",
                component: 'home',
                meta: {
                    icon: "icon-shouyefill",
                    title: "首页",
                    en_title: "Home",
                    affix: true,
                    keep: true
                }
            },
        ]
    },
    {
        id: 2,
        path: "/auth",
        component: 'layout',
        redirect: '/auth/menu-settings',
        nested: true,
        meta: {
            title: "权限管理",
            en_title: "Permission",
            icon: "icon-quanxian1",
        },
        children: [
            {
                id: 3,
                path: "menu-settings",
                name: 'menu-settings',
                component: 'auth/menu-settings',
                meta: {
                    title: "菜单设置",
                    en_title: "Menu settings",
                    keep: true
                },
            },
            {
                id: 4,
                path: "role-settings",
                name: 'role-settings',
                component: 'auth/role-settings',
                meta: {
                    title: "角色设置",
                    en_title: "Role settings",
                    keep: false
                }
            },
            {
                id: 5,
                path: "user-settings",
                name: 'user-settings',
                component: 'auth/user-settings',
                meta: {
                    title: "用户设置",
                    en_title: "User settings",
                    keep: true,
                }
            }
        ]
    },
    {
        id: 6,
        path: '/components',
        name: 'components-demo',
        nested: true,
        component: 'layout',
        redirect: '/components/editor',
        meta: {
            title: "组件",
            en_title: "Components",
            icon: "icon-menu_cjgl",
        },
        children: [
            {
                id: 7,
                path: "editor",
                name: 'editor',
                component: 'components-demo/editor',
                meta: {
                    title: "富文本编辑器",
                    en_title: "Editor",
                    keep: false
                },
            },
            {
                id: 8,
                path: "picture-upload",
                name: 'picture-upload',
                component: 'components-demo/picture-upload',
                meta: {
                    title: "头像上传",
                    en_title: "Picture upload",
                    keep: true
                },
            },
            {
                id: 9,
                path: "kanban",
                name: 'kanban',
                component: 'components-demo/kanban',
                meta: {
                    title: "可拖拽看板",
                    en_title: "Drag panel",
                    keep: true
                },
            },
            {
                path: "nested/menu1",
                name: "nested",
                component: 'components-demo/nested',
                nested: true,
                meta: {
                    title: "乔套",
                    en_title: "nested",
                    keep: false
                },
                children: [{
                    path:"menu1",
                    name:"menu1",
                    component: 'components-demo/nested/menu1',
                    meta: {
                        title: "menu1",
                        en_title: "menu1",
                        keep: true
                    },
                }]
            }
        ]
    },
    {
        id: 10,
        path: '/',
        component: 'layout',
        redirect: '/wen',
        nested: false,
        children: [
            {
                path: "wen",
                name: "wen",
                component: 'wen',
                meta: {
                    icon: "icon-dianji",
                    title: "闻",
                    en_title: "wen",
                    keep: false
                }
            },
        ]
    },
]


export const defaultConfig = {
    imgPrefixUrl: "http://img.joooyoo.com/",
    uploadUrl: "https://upload-z2.qiniup.com",
}