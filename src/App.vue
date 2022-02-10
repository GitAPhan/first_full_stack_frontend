<template>
  <div>
    <section class="login_container">
      <!-- logged in view -->
      <div v-if="login_status">
        <h1>Welcome back {{ this.username }}!</h1>
        <p class="login_status_message">{{ login_status_message }}</p>
        <button @click="logout_user">logout</button>
        <article>
          <form action="javascript:void(0)">
            <h3>Post your candy here</h3>
            <input
              type="text"
              name="Candy Title"
              placeholder="Candy Title"
              ref="candy_title"
            />
            <input
              type="text"
              name="Candy Description"
              placeholder="Candy Description"
              ref="candy_description"
            />
            <input type="submit" value="post candy" @click="post_candy" ref="post_candy"/>
            <input type="submit" value="edit candy" @click="patch_candy" ref="patch_candy">
            <input type="submit" value="delete candy" @click="delete_candy" ref="delete_candy">
          </form>
        </article>
      </div>
      <!-- logged out view -->
      <form v-else action="javascript:void(0)">
        <input
          type="text"
          name="username"
          placeholder="username"
          ref="login_username"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          ref="login_password"
        />
        <p class="login_status_message">{{ login_status_message }}</p>
        <input type="submit" value="login" @click="login_user" />
      </form>
    </section>
    <!-- candy display -->
    <div v-for="candy in candies" :key="candy.id" class="candy_container">
      <h1>{{ candy.id }}:{{ candy.name }}</h1>
      <h4>{{ candy.description }}</h4>
      <p>posted by: {{ candy.username }}</p>
      <input
        type="submit"
        value="edit candy"
        @click="edit_candy(candy.id, candy.name, candy.description)"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "vue-cookies";

export default {
  data() {
    return {
      candies: [],
      login_status: false,
      update_key: 35230,
      username: undefined,
      login_status_message: undefined,
    };
  },
  methods: {
    logout_user() {
      this.update_status_message("attempting to logout....");
      // request to logout user
      axios
        .request({
          url: "http://localhost:5000/user",
          method: "DELETE",
          data: {
            loginToken: Cookies.get("loginToken").loginToken,
          },
        })
        .then((response) => {
          Cookies.remove("loginToken");
          this.login_status = false;
          // this.update_key++;
          this.update_status_message(response.data);
        })
        .catch((error) => {
          error;
        });
    },
    login_user() {
      this.update_status_message("attempting to login....");
      var username = this.$refs.login_username.value;
      var password = this.$refs.login_password.value;

      // request for login
      axios
        .request({
          url: "http://localhost:5000/user",
          method: "POST",
          data: {
            username: username,
            password: password,
          },
        })
        .then((response) => {
          Cookies.set("loginToken", JSON.stringify(response.data));
          this.username = username;
          this.login_status = true;
        })
        .catch((error) => {
          // to catch if backend is down
          if (error.response === undefined) {
            this.update_status_message(
              "Oh no, looks like our servers are down. Please try again in 10 mins!"
            );
          } else {
            this.update_status_message(error.response.data);
          }
        });
    },
    // this function is to grab info of item to be patched and place into form
    edit_candy(id, name, description) {
      this.update_status_message("Make your changes below");

      // insert info into form
      this.$refs.candy_title.value = name;
      this.$refs.candy_description.value = description;
      // this.$refs.submit_candy.
      id
    },
    post_candy() {
      this.update_status_message("attempting to post your candy");
      var name = this.$refs.candy_title.value;
      var description = this.$refs.candy_description.value;

      // request to post candy to db
      axios
        .request({
          url: "http://localhost:5000/candy",
          method: "POST",
          data: {
            name: name,
            description: description,
            loginToken: Cookies.get("loginToken").loginToken,
          },
        })
        .then((response) => {
          this.update_status_message(response.data.message);
          // clear values after submit
          this.$refs.candy_title.value = "";
          this.$refs.candy_description.value = "";
          // posted candy, this will be added to list
          var candy = {
            id: response.data.candy_id,
            name: name,
            description: description,
            username: this.username,
          };
          this.candies.unshift(candy);
        })
        .catch((error) => {
          this.update_status_message(error.response.data);
          // clear values after submit
          this.$refs.candy_title.value = "";
          this.$refs.candy_description.value = "";
        });
    },
    get_candy() {
      // axios request to get candy posts
      axios
        .request({
          url: "http://localhost:5000/candy",
        })
        .then((response) => {
          this.candies = response.data;
        })
        .catch((error) => {
          // to catch if backend is down
          if (error.response === undefined) {
            this.update_status_message(
              "Oh no, looks like our servers are down. Please try again in 10 mins!"
            );
          } else {
            this.update_status_message(error.response.data);
          }
        });
    },
    login_check() {
      // function to check if there is a loginToken present and setting the login_status
      if (Cookies.get("loginToken") != null) {
        this.login_status = true;
        this.username = Cookies.get("loginToken").username;
        // this.update_key++;
      }
    },
    update_status_message(payload) {
      // function to update
      this.login_status_message = payload;
      setTimeout(() => {
        this.login_status_message = undefined;
      }, 5000);
    },
  },
  mounted() {
    // grab candy post when component loads
    this.get_candy();
    // checks cookies to see if the user is logged in
    this.login_check();
  },
};
</script>

<style scoped>
</style>