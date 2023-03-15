/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(["./when-0488ac89","./Check-78ca6843","./Math-8a4c9da1","./Cartesian2-cc1e6450","./defineProperties-c6a70625","./Transforms-fa4f10bc","./RuntimeError-4d6e0952","./WebGLConstants-66e14a3b","./ComponentDatatype-9252f28f","./AttributeCompression-fe1560e2","./IndexDatatype-8575c917","./IntersectionTests-12255a09","./Plane-466db411","./createTaskProcessorWorker","./EllipsoidTangentPlane-70069c84","./OrientedBoundingBox-5e4e94f2","./TerrainEncoding-05a676fa"],function(w,e,ce,ge,t,me,i,n,s,r,xe,h,u,o,a,ve,we){"use strict";var Ce={clipTriangleAtAxisAlignedThreshold:function(e,t,i,n,s,r){var h,u,o;w.defined(r)?r.length=0:r=[],o=t?(h=i<e,u=n<e,s<e):(h=e<i,u=e<n,e<s);var a,p,d,f,l,c,g=h+u+o;return 1===g?h?(a=(e-i)/(n-i),p=(e-i)/(s-i),r.push(1),r.push(2),1!==p&&(r.push(-1),r.push(0),r.push(2),r.push(p)),1!==a&&(r.push(-1),r.push(0),r.push(1),r.push(a))):u?(d=(e-n)/(s-n),f=(e-n)/(i-n),r.push(2),r.push(0),1!==f&&(r.push(-1),r.push(1),r.push(0),r.push(f)),1!==d&&(r.push(-1),r.push(1),r.push(2),r.push(d))):o&&(l=(e-s)/(i-s),c=(e-s)/(n-s),r.push(0),r.push(1),1!==c&&(r.push(-1),r.push(2),r.push(1),r.push(c)),1!==l&&(r.push(-1),r.push(2),r.push(0),r.push(l))):2===g?h||i===e?u||n===e?o||s===e||(p=(e-i)/(s-i),d=(e-n)/(s-n),r.push(2),r.push(-1),r.push(0),r.push(2),r.push(p),r.push(-1),r.push(1),r.push(2),r.push(d)):(c=(e-s)/(n-s),a=(e-i)/(n-i),r.push(1),r.push(-1),r.push(2),r.push(1),r.push(c),r.push(-1),r.push(0),r.push(1),r.push(a)):(f=(e-n)/(i-n),l=(e-s)/(i-s),r.push(0),r.push(-1),r.push(1),r.push(0),r.push(f),r.push(-1),r.push(2),r.push(0),r.push(l)):3!==g&&(r.push(0),r.push(1),r.push(2)),r},computeBarycentricCoordinates:function(e,t,i,n,s,r,h,u,o){var a=i-h,p=h-s,d=r-u,f=n-u,l=1/(d*a+p*f),c=t-u,g=e-h,m=(d*g+p*c)*l,x=(-f*g+a*c)*l,v=1-m-x;return w.defined(o)?(o.x=m,o.y=x,o.z=v,o):new ge.Cartesian3(m,x,v)},computeLineSegmentLineSegmentIntersection:function(e,t,i,n,s,r,h,u,o){var a=(u-r)*(i-e)-(h-s)*(n-t);if(0!=a){var p=((h-s)*(t-r)-(u-r)*(e-s))/a,d=((i-e)*(t-r)-(n-t)*(e-s))/a;return 0<=p&&p<=1&&0<=d&&d<=1?(w.defined(o)||(o=new ge.Cartesian2),o.x=e+p*(i-e),o.y=t+p*(n-t),o):void 0}}},ye=32767,Be=16383,Ie=[],Ae=[],be=[],Te=new ge.Cartographic,ze=new ge.Cartesian3,Me=[],Ne=[],Ve=[],Ee=[],Re=[],He=new ge.Cartesian3,Oe=new me.BoundingSphere,Pe=new ve.OrientedBoundingBox,Se=new ge.Cartesian2,Ue=new ge.Cartesian3;function Fe(){this.vertexBuffer=void 0,this.index=void 0,this.first=void 0,this.second=void 0,this.ratio=void 0}Fe.prototype.clone=function(e){return w.defined(e)||(e=new Fe),e.uBuffer=this.uBuffer,e.vBuffer=this.vBuffer,e.heightBuffer=this.heightBuffer,e.normalBuffer=this.normalBuffer,e.index=this.index,e.first=this.first,e.second=this.second,e.ratio=this.ratio,e},Fe.prototype.initializeIndexed=function(e,t,i,n,s){this.uBuffer=e,this.vBuffer=t,this.heightBuffer=i,this.normalBuffer=n,this.index=s,this.first=void 0,this.second=void 0,this.ratio=void 0},Fe.prototype.initializeFromClipResult=function(e,t,i){var n=t+1;return-1!==e[t]?i[e[t]].clone(this):(this.vertexBuffer=void 0,this.index=void 0,this.first=i[e[n]],++n,this.second=i[e[n]],++n,this.ratio=e[n],++n),n},Fe.prototype.getKey=function(){return this.isIndexed()?this.index:JSON.stringify({first:this.first.getKey(),second:this.second.getKey(),ratio:this.ratio})},Fe.prototype.isIndexed=function(){return w.defined(this.index)},Fe.prototype.getH=function(){return w.defined(this.index)?this.heightBuffer[this.index]:ce.CesiumMath.lerp(this.first.getH(),this.second.getH(),this.ratio)},Fe.prototype.getU=function(){return w.defined(this.index)?this.uBuffer[this.index]:ce.CesiumMath.lerp(this.first.getU(),this.second.getU(),this.ratio)},Fe.prototype.getV=function(){return w.defined(this.index)?this.vBuffer[this.index]:ce.CesiumMath.lerp(this.first.getV(),this.second.getV(),this.ratio)};var p=new ge.Cartesian2,d=-1,f=[new ge.Cartesian3,new ge.Cartesian3],l=[new ge.Cartesian3,new ge.Cartesian3];function c(e,t){var i=f[++d],n=l[d];return i=r.AttributeCompression.octDecode(e.first.getNormalX(),e.first.getNormalY(),i),n=r.AttributeCompression.octDecode(e.second.getNormalX(),e.second.getNormalY(),n),ze=ge.Cartesian3.lerp(i,n,e.ratio,ze),ge.Cartesian3.normalize(ze,ze),r.AttributeCompression.octEncode(ze,t),--d,t}Fe.prototype.getNormalX=function(){return w.defined(this.index)?this.normalBuffer[2*this.index]:(p=c(this,p)).x},Fe.prototype.getNormalY=function(){return w.defined(this.index)?this.normalBuffer[2*this.index+1]:(p=c(this,p)).y};var g=[];function ke(e,t,i,n,s,r,h,u,o){if(0!==h.length){for(var a=0,p=0;p<h.length;)p=g[a++].initializeFromClipResult(h,p,u);for(var d=0;d<a;++d){var f=g[d];if(f.isIndexed())f.newIndex=r[f.index],f.uBuffer=e,f.vBuffer=t,f.heightBuffer=i,o&&(f.normalBuffer=n);else{var l=f.getKey();if(w.defined(r[l]))f.newIndex=r[l];else{var c=e.length;e.push(f.getU()),t.push(f.getV()),i.push(f.getH()),o&&(n.push(f.getNormalX()),n.push(f.getNormalY())),f.newIndex=c,r[l]=c}}}3===a?(s.push(g[0].newIndex),s.push(g[1].newIndex),s.push(g[2].newIndex)):4===a&&(s.push(g[0].newIndex),s.push(g[1].newIndex),s.push(g[2].newIndex),s.push(g[0].newIndex),s.push(g[2].newIndex),s.push(g[3].newIndex))}}return g.push(new Fe),g.push(new Fe),g.push(new Fe),g.push(new Fe),o(function(e,t){var i=e.isEastChild,n=e.isNorthChild,s=i?Be:0,r=i?ye:Be,h=n?Be:0,u=n?ye:Be,o=Me,a=Ne,p=Ve,d=Re;o.length=0,a.length=0,p.length=0,d.length=0;var f=Ee;f.length=0;var l={},c=e.vertices,g=e.indices;g=g.subarray(0,e.indexCountWithoutSkirts);var m,x,v,w,C,y=we.TerrainEncoding.clone(e.encoding),B=y.hasVertexNormals,I=e.exaggeration,A=0,b=e.vertexCountWithoutSkirts,T=e.minimumHeight,z=e.maximumHeight,M=new Array(b),N=new Array(b),V=new Array(b),E=B?new Array(2*b):void 0;for(v=x=0;x<b;++x,v+=2){var R=y.decodeTextureCoordinates(c,x,Se);if(m=y.decodeHeight(c,x)/I,w=ce.CesiumMath.clamp(R.x*ye|0,0,ye),C=ce.CesiumMath.clamp(R.y*ye|0,0,ye),V[x]=ce.CesiumMath.clamp((m-T)/(z-T)*ye|0,0,ye),w<20&&(w=0),C<20&&(C=0),ye-w<20&&(w=ye),ye-C<20&&(C=ye),M[x]=w,N[x]=C,B){var H=y.getOctEncodedNormal(c,x,Ue);E[v]=H.x,E[v+1]=H.y}(i&&Be<=w||!i&&w<=Be)&&(n&&Be<=C||!n&&C<=Be)&&(l[x]=A,o.push(w),a.push(C),p.push(V[x]),B&&(d.push(E[v]),d.push(E[v+1])),++A)}var O=[];O.push(new Fe),O.push(new Fe),O.push(new Fe);var P,S=[];for(S.push(new Fe),S.push(new Fe),S.push(new Fe),x=0;x<g.length;x+=3){var U=g[x],F=g[x+1],k=g[x+2],D=M[U],W=M[F],X=M[k];O[0].initializeIndexed(M,N,V,E,U),O[1].initializeIndexed(M,N,V,E,F),O[2].initializeIndexed(M,N,V,E,k);var K=Ce.clipTriangleAtAxisAlignedThreshold(Be,i,D,W,X,Ie);(P=0)>=K.length||(P=S[0].initializeFromClipResult(K,P,O))>=K.length||(P=S[1].initializeFromClipResult(K,P,O))>=K.length||(P=S[2].initializeFromClipResult(K,P,O),ke(o,a,p,d,f,l,Ce.clipTriangleAtAxisAlignedThreshold(Be,n,S[0].getV(),S[1].getV(),S[2].getV(),Ae),S,B),P<K.length&&(S[2].clone(S[1]),S[2].initializeFromClipResult(K,P,O),ke(o,a,p,d,f,l,Ce.clipTriangleAtAxisAlignedThreshold(Be,n,S[0].getV(),S[1].getV(),S[2].getV(),Ae),S,B)))}var L=i?-ye:0,Y=n?-ye:0,_=[],G=[],J=[],Z=[],j=Number.MAX_VALUE,q=-j,Q=be;Q.length=0;var $=ge.Ellipsoid.clone(e.ellipsoid),ee=ge.Rectangle.clone(e.childRectangle),te=ee.north,ie=ee.south,ne=ee.east,se=ee.west;for(ne<se&&(ne+=ce.CesiumMath.TWO_PI),x=0;x<o.length;++x)w=(w=Math.round(o[x]))<=s?(_.push(x),0):r<=w?(J.push(x),ye):2*w+L,o[x]=w,C=(C=Math.round(a[x]))<=h?(G.push(x),0):u<=C?(Z.push(x),ye):2*C+Y,a[x]=C,(m=ce.CesiumMath.lerp(T,z,p[x]/ye))<j&&(j=m),q<m&&(q=m),p[x]=m,Te.longitude=ce.CesiumMath.lerp(se,ne,w/ye),Te.latitude=ce.CesiumMath.lerp(ie,te,C/ye),Te.height=m,$.cartographicToCartesian(Te,ze),Q.push(ze.x),Q.push(ze.y),Q.push(ze.z);var re=me.BoundingSphere.fromVertices(Q,ge.Cartesian3.ZERO,3,Oe),he=ve.OrientedBoundingBox.fromRectangle(ee,j,q,$,Pe),ue=new we.EllipsoidalOccluder($).computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid(re.center,Q,3,re.center,j,He),oe=q-j,ae=new Uint16Array(o.length+a.length+p.length);for(x=0;x<o.length;++x)ae[x]=o[x];var pe=o.length;for(x=0;x<a.length;++x)ae[pe+x]=a[x];for(pe+=a.length,x=0;x<p.length;++x)ae[pe+x]=ye*(p[x]-j)/oe;var de,fe=xe.IndexDatatype.createTypedArray(o.length,f);if(B){var le=new Uint8Array(d);t.push(ae.buffer,fe.buffer,le.buffer),de=le.buffer}else t.push(ae.buffer,fe.buffer);return{vertices:ae.buffer,encodedNormals:de,indices:fe.buffer,minimumHeight:j,maximumHeight:q,westIndices:_,southIndices:G,eastIndices:J,northIndices:Z,boundingSphere:re,orientedBoundingBox:he,horizonOcclusionPoint:ue}})});
