import LargeMarginClassifiers from './large_margin_classifiers/Main';
import SingularValueDecomposition from './singular_value_decomposition/Main';
import VanillaNeuralNetwork from './vanilla_neural_network/Main';
import DeepCryptokitties from './deep_cryptokitties/Main';
import Rnns from './rnns/Main';

// Although it might not be the very best solution, I am going to just
// register each article on the router for now. Anything that doesn't match
// will pass right along to the 404 handler.
export default [
  {
    path: 'large-margin-classifiers',
    component: LargeMarginClassifiers,
    meta: { title: 'Large margin classifiers' }
  },
  {
    path: 'singular-value-decomposition',
    component: SingularValueDecomposition,
    meta: { title: 'Singular Value Decomposition' }
  },
  {
    path: 'vanilla-neural-network',
    component: VanillaNeuralNetwork,
    meta: { title: 'I made a vanilla neural network from scratch' }
  },
  {
    path: 'deep-cryptokitties',
    component: DeepCryptokitties,
    meta: { title: 'Deep Cryptokitties' }
  },
  {
    path: 'recurrent-neural-networks',
    component: Rnns,
    meta: { title: 'Some Recurrent Neural Networks, just for fun' }
  }
];
