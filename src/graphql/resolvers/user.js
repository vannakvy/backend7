import { hash, compare } from "bcryptjs";
import logger from '../../config/logger.js'

import { ApolloError } from "apollo-server-express";


import { serializeUser, issueAuthToken } from "../../helpers/Userfunctions";

import {
  UserRegisterationRules,
  UserAuthenticationRules,
} from "../../validations";
import { partial } from "lodash";

const UserLabels = {
  docs: "users",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalDocs",
  totalPages: "totalPages",
};

export default {
  // Standarad User Query Property
  Query: {
    /**
     * @DESC to get the authenticated User
     * @Headers Authorization
     * @Access Private
     */
    authUser: (_, __, { req: { user } }) => user,

    // @Desc get all users
    // @Access

    allUsers: async (_, {}, { User, req }) => {
      const users = await User.find({});
      return users;
    },
    getUserById: async (_, { userId }, { User,user }) => {
      const users = await User.findById(userId);
      if (!users) {
        logger.log('error',`${user.userName},${user._id} trying to get the user by id but cannot find it from the database`)
        throw new ApolloError("There is no user with this id", "404");
      }
      return users;
    },
    //@Desc get all users with pagination

    getUserWithPagination: async (
      _,
      { page, limit, keyword = "" },
      { User }
    ) => {

      
      let key = keyword.toString();
   
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: UserLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "customer",
      };

      let query = {
        $or: [
          { firstName: { $regex: key, $options: "i" } },
          { lastName: { $regex: key, $options: "i" } },
          { email: { $regex: key, $options: "i" } },
        ],
      };

      let users = await User.paginate(query, options);
      // console.log(users)
      return users;
    },
  },
  // Standarad User Mutation Property

  Mutation: {
    /**
     * @DESC to authenticate using parameters
     * @Params { username, password }
     * @Access Public
     */
    loginUser: async (_, { username, password }, { User }) => {
      // Validate Incoming User Credentials
      await UserAuthenticationRules.validate(
        { username, password },
        { abortEarly: false }
      );
      // Find the user from the database
      let user = await User.findOne({
        username,
      });
      
      // If User is not found
      if (!user) {
        logger.log('error',`${username}, trying to login but cannot find it from the database`)
        throw new ApolloError("Username not found", "404");
      }
      // If user is found then compare the password
      let isMatch = await compare(password, user.password);
     
      // If Password don't match
      if (!isMatch) {
        logger.log('error',`${username}, trying to login but the password does not match`)
        throw new ApolloError("The password is not correct");
      }
      user = await serializeUser(user);

      // Issue Token
      let token = await issueAuthToken(user);
      logger.log('info',`${user.username},${user.id} is logging in successfully`)
      return {
        user,
        token,
      };
    },

    /**
     * @DESC add role
     * @Params userId and new role
     * @Access admin
     */
    addRole: async (_, { userId, role }, { User,user }) => {
      try {
       
        let users = await User.findById(userId);
        if (users) {
          const search =(role) => users.roles.find(element => element.role === role);
          if (search()) {

            logger.log('error',`${user.username},${user.id} trying to add the role but the role : ${role} is already exist`);
            return {
              message: "this role is already exist",
              success: false,
            };
          } else {
            users.roles.push({ role });
            let a = await users.save();
            logger.log('info',`${user.username},${user.id} add the role : ${role} successfully`);
            return {
              success: true,
              message: "Role added succesfully",
            };
          }
        }
      } catch (error) {
        logger.log('error',`${user.username},${user.id} add the role: ${role} Not success ${error.message}`);
        return {
          message: "Cannot add new roles",
        };
      }
    },

    // @DESC deleteRole
    // @params userid , role id
    // @access Admin

    deleteRole: async (_, { userId, roleId }, { User,user }) => {
      try {
        const res = await User.findById(userId);
        const hasRole = res.roles.find(
          (r) => r._id.toString() === roleId.toString()
        );

        if (!hasRole) {
          logger.log('error',`${user.username},${user.id} delete roleId: ${roleId} but Not found in db`);
          return {
            success: false,
            message: "There is no this role in this user",
          };
        }
        res.roles.id(hasRole._id).remove();
        await res.save();
        logger.log('info',`${user.username},${user.id} delete roleId: ${roleId} successfully`);
        // doc.subdocs.pull({ _id: 4815162342 })  => the second way to delete below object in array of subdocs
        return {
          success: true,
          message: "Role Deleted successfully!",
        };
      } catch (error) {
        logger.log('error',`${user.username},${user.id} delete roleId: ${roleId} not success with the error: ${error}`);
        return {
          success: false,
          message: "Role Delete is not completed !",
        };
      }
    },
    /**
     * @DESC to Register new user
     * @Params newUser{ username, firstName, lastName, email, password }
     * @Access Public
     */
    registerUser: async (_, { newUser }, { User,user }) => {
      try {
        let { email, username } = newUser;
        // Validate Incoming New User Arguments
        await UserRegisterationRules.validate(newUser, { abortEarly: false });
        // Check if the Username is taken
        let users = await User.findOne({
          username,
        });
        if (users) {
          logger.log('error',`${user.username},${user.id} create user with userName: ${username}, username is already exist`);
          return {
            success: false,
            message: "មិនអាចបង្កើតបានទេ ",
          };
        }

        // Check is the Email address is already registred
        users = await User.findOne({
          email,
        });
        if (users) {
          logger.log('error',`${user.username},${user.id} create user with userName: ${username} and email: ${email} email is already exist`);
          return {
            success: false,
            message: "the email is already token",
          };
        }
        // New User's Account can be created
        user = new User(newUser);
        await users.roles.push({ role: newUser.role });

        // Hash the user password
        users.password = await hash(user.password, 10);
        // Save the user to the database
        let result = await users.save();
        logger.log('info',`${user.username},${user.id} create user with userName: ${username} successfully`);
        // result = await serializeUser(result);
        // // Issue Token
        // let token = await issueAuthToken(result);
        if (result) {
          return {
            success: true,
            message: " The user is created successfully !",
          };
        }
      } catch (err) {
        logger.log('error',`${user.username},${user.id} create user with userName: ${username} not success ${err.message}`);
        return {
          success: false,
          message: " Cannot create this user please contact the admin ",
        };
      }
    },
    //  /**
    //  * @DESC to Update  user
    //  * @Params newUser{ username, firstName, lastName, email, password }
    //  * @Access Private
    //  */
    updateAccount: async (_, { userId, password, username }, { User,user }) => {
      try {
        let userExist = await User.findById(userId);
        let users = await User.findOne({
          username,
        });
        // console.log(userExist,"ddd")
        // console.log(user,"bb")

        if (userExist) {
          // Check if the Username is taken
          if (users === null || userExist.username === username) {
            userExist.username = username;
            userExist.password = await hash(password, 10);
            let result = await userExist.save();
            //       console.log(result,"result")
            //    result = await serializeUser(result);
            //  let a = await issueAuthToken(result);
            //  console.log(a)
            logger.log('info',`${user.username},${user.id} update user account: ${username} success`);
            return {
              message: "Successfully update the Account",
              success: true,
            };
          } else {
            logger.log('error',`${user.username},${user.id} update user account: ${username} not success`);
            return {
              message: "Cannot update this account",
              success: false,
            };
          }
        }
      } catch (err) {
        logger.log('error',`${user.username},${user.id} update user account: ${username} not success :${err.message}`);
        return {
          message: "This user is not exist",
          success: false,
        };
      }
    },

    //  /**
    //  * @DESC to Update  user
    //  * @Params newUser{ username, firstName, lastName, email, password }
    //  * @Access Private
    //  */
    //   updateUser: async (_, { updatedUser,userId }, { User }) => {
    //     try {
    //       let { email, username } = updatedUser;

    //       // Validate Incoming New User Arguments
    //       await UserRegisterationRules.validate(updatedUser, { abortEarly: false });
    //       // Check if the Username is taken
    //       let user = await User.findOne({
    //         username,
    //       });
    //       // if (user && user.id!==userId) {
    //       //   throw new ApolloError("This username is already taken .", "404");
    //       // }

    //       // Check is the Email address is already registred
    //       user = await User.findOne({
    //         email,
    //       });
    //       if (user && user.id !==userId ) {
    //         throw new ApolloError("Email is already registred.", "403");
    //       }

    //       // user = new User(newUser);
    //       user.username = updatedUser.username
    //       user.firstName = updatedUser.firstName
    //       user.lastName = updatedUser.lastName
    //       user.email = updatedUser.email
    //       if(updatedUser==="empty"){
    //         user.password === password
    //       }else{
    //         // Hash the user password
    //         user.password = await hash(updatedUser.password, 10);
    //       }
    //      let role = user.roles.find(a=>a.role ===updatedUser.role);
    //      if(!role){
    //       user.roles.push({role:updatedUser.role})
    //      }

    //       // Save the user to the database
    //       let result = await user.save();
    //       result = await serializeUser(result);
    //       // Issue Token
    //        await issueAuthToken(result);

    //       return {
    //         message:"Successfully update the user",
    //         success: true
    //       };
    //     } catch (err) {
    //       throw new ApolloError(err.message);
    //     }
    //   },
    /**
     * @DESC to update user detail
     * @Params userId
     * @Access Private
     */
    updateUserDetail: async (
      _,
      { userId, email, tel, firstName, lastName },
      { User }
    ) => {
      try {
        let user = await User.findById(userId);
        if (user) {
          (user.email = email), (user.tel = tel);
          user.firstName = firstName;
          user.lastName = lastName;
          await user.save();
    
          
          return {
            success: true,
            message: "User account detail updated successfully",
          };
        } else {
          return {
            success: false,
            message: "User account cannot be updated",
          };
        }
      } catch (error) {
        return {
          success: false,
          message: "User account cannot be updated",
        };
      }
    },
    /**
     * @DESC to delete the  user
     * @Params userId
     * @Access Private
     */
    deleteUser: async (_, { userId }, { User }) => {
      try {
        let user = await User.findByIdAndDelete(userId);
        if (user) {
          return {
            message: "Delete succesfully!",
            success: true,
          };
        } else {
          return {
            message: "There is no this user to delete ",
            success: false,
          };
        }
      } catch (error) {
        return {
          message: error.message,
          success: false,
        };
      }
    },

    /**
     * @DESC to update profile image of the staff
     * @Params userId, imagelink
     * @Access Private
     */
    updateProfileImage: async (_, { userId, image }, { User }) => {
      try {
        let user = await User.findById(userId);
        if (user) {
          user.image = image;
          user.save();
          return {
            message: "Profile Image updated successfully",
            success: true,
          };
        } else {
          return {
            message: "there is no file to update profile picture",
            success: false,
          };
        }
      } catch (error) {
        return {
          message: error.message,
          success: false,
        };
      }
    },
  },
};
