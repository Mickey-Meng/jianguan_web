import {getUserBindOrganizations, getAllOrganization} from "@/api/system";

export const disposeOrg = () => {
  return new Promise(resolve => {
    let obj = {
      users: [],
      org: []
    };
    let promise1 = new Promise((resolve1 => {
      getUserBindOrganizations().then(res => {
        obj.users = res.data;
        resolve1();
      });
    }));
    let promise2 = new Promise((resolve2 => {
      getAllOrganization().then(res => {
        obj.org = res.data.personGroups;
        resolve2();
      });
    }));
    Promise.all([promise1, promise2]).then(res => {
      let {users, org} = obj;
      const findSon = function (item, data) {
        if (item.pid === 0) {
          let children = data.filter((e) => e.pid === item.id);
          if (children && children.length > 0) {
            item.children = findDescendant(children);
            item.post = findDescendant(children);
          } else {
            item.children = [];
            item.post = [];
          }
          return item;
        }
      };
      const findDescendant = function (children) {
        let arr = [];
        for (let i = 0; i < children.length; i++) {
          let item = children[i];
          let user = users.filter(e => {
            e.name = e.username;
            return e.personGroupid === item.id;
          });
          let post = [];
          let arr1 = JSON.parse(JSON.stringify(user));
          arr1.forEach(item => {
            let obj = post.find(e => e.roleid === item.roleid);
            if (!obj) {
              item.name = item.rolename;
              post.push(item);
            }
          });
          item.children = user || [];
          item.post = post || [];
          arr.push(item);
        }
        return arr;
      };

      let tree = [];
      for (let i = 0; i < org.length; i++) {
        let item = org[i];
        let node = findSon(item, org);
        if (node) {
          tree.push(node);
        }
      }
      resolve(tree);
    });
  });


};
