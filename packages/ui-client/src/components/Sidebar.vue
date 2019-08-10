<template>
  <aside class="w-64 bg-gray-800 shadow-lg h-full p-6 flex-none">
    <WatchServerButton />
    <ul>
      <li>
        <button>Plugins</button>
      </li>
      <li v-for="item in sidebar" :key="item">
        <button>{{item.text }}</button>
      </li>
    </ul>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
import gql from "graphql-tag";
export default Vue.extend({
  apollo: {
    $subscribe: {
      uiSettingsChanged: {
        query: gql`
          subscription uiSettingsChanged {
            uiSettingsChanged {
              sidebar {
                pageName
                text
              }
            }
          }
        `,
        result({ data: { uiSettingsChanged } }) {
          console.log(uiSettingsChanged);
          this["sidebar"] =
            (uiSettingsChanged && uiSettingsChanged.sidebar) || [];
        }
      }
    }
  },
  data() {
    return {
      sidebar: []
    };
  }
});
</script>
