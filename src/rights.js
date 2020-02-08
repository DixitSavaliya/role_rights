import Auth from "./redux/Auth";
import { connect } from 'react-redux';

// const mapStateToProps = state => ({
//     rights: state.auth.rights
// });

// const mapDispatchToProps = (dispatch) => ({
//     getRights: (rights) => { dispatch({ type: 'GETUSERRIGHTS', payload: rights }) }
// });

export default function checkRights(module_name, type) {

    let user_right = JSON.parse(Auth.getRight());
    // console.log("user_right",user_right)
    if (user_right && user_right.length) {
        if (module_name && type) {
            var flag = 0;
            let ind = user_right.findIndex((x) => x.name == module_name);
            if (ind > -1) {
                // console.log("type",type)
                // console.log("module_name",module_name)
                if (type == "read" && user_right[ind].read == 1) {
                    flag = 1;
                }
                if (type == "write" && user_right[ind].write == 1) {
                    flag = 1;
                }
                if (type == "delete" && user_right[ind].delete == 1) {
                    flag = 1;
                }
                if (type == "import" && user_right[ind].import == 1) {
                    flag = 1;
                }
                if (type == "export" && user_right[ind].export == 1) {
                    flag = 1;
                }
            }
            return flag == 1 ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(checkRights)