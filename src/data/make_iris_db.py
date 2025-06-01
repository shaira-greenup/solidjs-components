import duckdb
import matplotlib.pyplot as plt
import numpy as np
import polars as pl
import seaborn as sns
import sympy as sp
import sqlite3
pl.Config(tbl_cols=int(80 / 5), tbl_rows=6)

df = sns.load_dataset('iris')

# Save dataframe to SQLite file
conn = sqlite3.connect('iris.db')
df.to_sql('iris', conn, if_exists='replace', index=False)
conn.close()
