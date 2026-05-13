# Interface 
## 用法

### 空接口
```go
type Any interface {
    // empty
}
```

空接口可以理解为没有任何要求的接口类型，也可以说所有的类型都实现了空接口。

### 有方法的接口
若一个类型实现了接口中的所有方法，那么这个类型就实现了这个接口

```go
type Person interface {
    GetName() string
}

type Student struct {
    Name string
}

func (s Student) GetName() string {
    return s.Name
}
```
