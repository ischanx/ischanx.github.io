<template>
<div>
    <div>
        <h4>Virtual Judge</h4>
        <b>已通过题目数：</b>{{ac}}
        <b>尚未通过题目数:</b>{{fail}}
        <b>总共:</b>{{total}}
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return({
            data:null,
            ac:0,
            fail:0,
            total:0,
        })
    },
    mounted(){
        let _this = this
            let id = "mchanx";
            axios({
                method:'get',
                url:'https://vjudge.net/user/solveDetail/'+id,
                })
                .then(function(response) {
                console.log(response)
                let data = response.data;
                const acRecords = data.acRecords;
                const failRecords = data.failRecords;
                let ac = 0;
                let fail = 0;
                for(let i in acRecords){
                    ac += acRecords[i].length;
                }
                for(let i in failRecords){
                    fail += failRecords[i].length;
                }
                const total = ac + fail;
                console.log(ac,fail,total)
                _this.data = data;
                _this.ac = ac;
                _this.fail = fail;
                _this.total = total;
            });
        // });

        //https://www.luogu.com.cn/user/148669#practice
        //http://codeforces.com/profile/Chanx
    },
    methods:{

    }
}
</script>

<style>

</style>