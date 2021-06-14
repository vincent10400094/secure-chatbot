import jieba
from gensim.models import Word2Vec
import random
model = Word2Vec.load('./word2vec.model')
def replace(msg, k):
  msg_list = list(jieba.cut(msg, cut_all=False))
  #print("Default Mode: " + "/ ".join(msg_list))
  ans = []
  for word in (msg_list): 
    ans.append(model.wv.most_similar(word, topn=k)[random.randint(0, k-1)][0])
  return "".join(ans)
