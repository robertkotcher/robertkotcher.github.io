<template>
  <div>
    <h1>Chinese Proverbs with Airflow</h1>
    <p>
        My current job involves generating AI data at scale in a pipeline. As we develop the system, the Apache Airflow project has come up in conversation quite a bit. Since I’d never used it before, I thought I’d give it a try.
    </p>
    <p>
        This project is a Chinese Proverb generator. Every day, it scans my Chinese blog to see what words I’m using and their frequencies. Then it reads a dataset of Chinese proverbs from <a href='https://www.kaggle.com/datasets/bryanb/phrases-and-sayings' target='_blank'>Kaggle</a> and suggests one that introduces new words (but not too many new words).
    </p>
    <p>
        The objective was to understand what is possible with Airflow and where it falls short. Any efforts that did not meet that description were done quickly and quite possibly suboptimally.
    </p>
    <h2>Airflow</h2>
    <p>
        Airflow is a platform for defining, running, and monitoring workflows. The workflows are defined as a <a target='_blank' href='https://en.wikipedia.org/wiki/Directed_acyclic_graph'>DAG</a> containing many nodes - in airflow these are called tasks. A scheduler is responsible for understanding the relationships between tasks in a DAG, and triggering tasks when their parents have completed. A scheduler is also responsible for creating new task instances, i.e., for “kicking off” the DAG and orchestrating the instantiation of tasks. There are lots of ways to do this, but in this project I kick off the workflow once per day. In other words, my scheduler suggests one new Chinese proverb per day.
    </p>
    <p>
        Another important concept in Airflow is an operator, which is essentially a class that, when instantiated, becomes a task. Operators define different ways that data can be operated on, for example through a script, pod execution, or network call. In this project, I generally found that just running all tasks as a Python script was pretty easy, but it’s good to know that the flexibility of having other operator types exists. For example, there is an HttpOperator but I found that just using Python’s requests module was more intuitive for me. Whatever.
    </p>
    <h2>Chinese Proverb Pipeline</h2>
    <p>
        The Chinese Proverb Pipeline is fairly straightforward, as depicted in the diagram below. <strong>fetch_known_words</strong> scans my <a target='_blank' href='https://blog.robertkotcher.me'>language blog</a> for Chinese words that I've used in my writeups. <strong>fetch_proverbs</strong> fetches a CSV containing about 150 Chinese proverbs. <strong>choose_proverb</strong> combines the results of both of these operations and chooses a proverb that introduces new words, but not too many new words. Finally, <strong>save_proverb</strong> stores the proverb in an in-cluster data store.
    </p>
    <div class="image-container">
        <img class="pipeline-diagram" src="./chinese_proverb.png"/>
    </div>
    <p>
        I used the <a target='_blank' href='https://airflow.apache.org/docs/apache-airflow/stable/tutorial_taskflow_api.html'>TaskFlow API</a>, which is part of Airflow 2. TaskFlow allows the developer to define tasks as Python functions with decorators. In the case that the developer wants to write a task that isn’t in the form of a Python function (which operator is used?), they can fall back to instantiating that Operator directly. It does other things like abstract out the inner-workings of <a target='_blank' href='https://airflow.apache.org/docs/apache-airflow/stable/concepts/xcoms.html'>Xcoms</a>.
    </p>
    <p>
        I found TaskFlow to be much easier and cleaner to work with.
    </p>
    <h3>Design Choices</h3>
    <ul>
        <li>
            I wanted to be sure that, as the number of known Chinese words grew, that the mechanism that passes data between tasks would be able to handle the growing size of the frequency map. Airflow allows task instances to communicate between one another with xcom. xcom uses the “metadata DB” to store return values from one task instance, and reveal those return values to children. I set up my metadata DB using Postgres (required when running tasks on kubernetes), and found that there weren’t any size constraints on the DB column that would be storing the word table.
        </li>
        <li>
            I debated different ways that the daily chosen Proverb would be communicated to me. As this project was focused on learning Airtable, I thought that configuring the final task to send me an email would be a good exercise. This can be done by overriding the pod template for the final task with credentials (set in a secret). Since email providers are paid, and I didn't feel like entering credit card information anywhere, I built a simple key/value store, spun it up in my cluster, and used that to store the most recently chosen proverb.
        </li>
    </ul>
    <h3>Things I really like about working with Airflow</h3>
    <ul>
        <li>
            Being able to run task instances locally, either via a full workflow instance, or as a single task instance.
        </li>
        <li>
            The ease of setting up a workflow, especially with TaskFlow API.
        </li>
        <li>
            Configurability (the flexibility of being able to run the same workflow on different environments, with different underlying transport mechanisms)
        </li>
        <li>
            A really intuitive GUI for monitoring, that just works quite well out-of-the-box.
        </li>
    </ul>
    <h3>Frustrations</h3>
    <p>
        While I actually had no frustrations with Airflow (at least with this simple project), I found that DigitalOcean and Airtable don't always play together nicely. This isn’t really a limitation of Airflow. For example, volumes can only run in ReadWriteOnce accessMode. This has implications for larger clusters. For example, if I have many nodes, I have to be sure that pods belonging to the same airflow task are always schedule on the same node.
    </p>
    <h2>The final product</h2>
    <p>Finally, here’s the pipeline in action. The following proverb was generated at 8 am UTC, based on the words I used in my blog:</p>
    <div class='proverb-container'>
        <span class='proverb'>
            今天的中国谚语是: 不作不死。
        </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main'
  };
</script>

<style scoped>
  .image-container {
      margin: 30px 0;
      width: 100%;
      display: flex;
      justify-content: center;
  }

  .pipeline-diagram {
    width: 320px;
    height: 130px;
  }

  ul {
      margin: 0 32px;
  }

  li {
      margin-top: 12px;
      margin-bottom: 12px;
  }

  .proverb-container {
      display: flex;
      justify-content: center;
  }

  .proverb {
      padding: 14px 28px;
      background-color: #fff665;
      margin-bottom: 42px;
  }
</style>
